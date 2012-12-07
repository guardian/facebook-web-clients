from google.appengine.ext import webapp
from google.appengine.api import urlfetch
from google.appengine.ext import db
import json, webapp2, logging, urllib

# live: app_namespace = "theguardian"
app_namespace = "guardian-gucode"

class UserVote(db.Model):
    userId = db.StringProperty(required=True)
    pollId = db.StringProperty(required=True)
    choice = db.StringProperty(required=False)
    def toMap(self):
        return {
            "userId": self.userId,
            "pollId": self.pollId,
            "choice": self.choice
        }

class FacebookPoll(db.Model):
    pollId = db.StringProperty(required=True)
    yesCount = db.IntegerProperty(required=True)
    noCount = db.IntegerProperty(required=True)

    def toMap(self):
        return {
            "pollId": self.pollId,
            "questions": [
                {
                    "count": self.yesCount + self.noCount,
                    "answers": [
                        {
                            "id": "agree",
                            "count": self.yesCount,
                            "label": "Agree"
                        },
                        {
                            "id": "disagree",
                            "count": self.noCount,
                            "label": "Disagree"
                        }
                    ]
                }
            ]
        }

def get_user_vote(article_id, user_id):
    q = db.GqlQuery("SELECT * FROM UserVote WHERE userId=:1 AND pollId=:2", user_id, article_id)
    if q.count() is 0:
        user = UserVote(
            userId=user_id,
            pollId=article_id
        )
    else:
        user = q.get()
    return user

def register_user_vote(article_id, user_id, choice):
    user = get_user_vote(article_id, user_id)

    if user.choice:
        logging.info("User has already voted")
        return False
    else:
        logging.info("User has not voted yet. Voting for: " + choice)
        user.choice = choice
        user.put()
        return True


def get_poll(articleId):
    q = db.GqlQuery("SELECT * FROM FacebookPoll WHERE pollId=:1", articleId)
    if q.count() is 0:
        poll = FacebookPoll(
            pollId=articleId,
            yesCount=0,
            noCount=0
        )
        poll.put()
    else:
        poll = q.get()
    return poll

def register_vote(articleId, choice):
    poll = get_poll(articleId)

    if choice == 'agree':
        logging.info("Yes count ++ " + choice)
        poll.yesCount = poll.yesCount + 1
    else:
        logging.info("No count ++ " + choice)
        poll.noCount = poll.noCount + 1

    poll.put()

def write_response(request, response, content_api_data):
    if request.get("callback"): # JSONP Request
        response.headers['Content-Type'] = 'text/javascript'
        response.out.write(request.get("callback") + "(")
        response.out.write(content_api_data)
        response.out.write(")")
    else:
        response.headers['Content-Type'] = 'application/json'
        response.out.write(content_api_data)

def post_to_facebook(article_id, facebook_token, choice):
    logging.info("Voting for: " + choice)

    form_fields = {
        "method": "post",
        "article": article_id,
        "access_token": facebook_token
    }

    url = "https://graph.facebook.com/me/%s:%s" % (app_namespace, choice)

    form_data = urllib.urlencode(form_fields)
    return urlfetch.fetch(url=url, payload=form_data, method=urlfetch.POST)

class UserHandler(webapp.RequestHandler):

    def get(self):
        article_id = self.request.get("article")
        user_id = self.request.get("user")
        obj = get_user_vote(article_id, user_id)
        write_response(self.request, self.response, json.dumps(obj.toMap()))

class GetVoteHandler(webapp.RequestHandler):
    def get(self):

        article_id = self.request.get("article")
        user_id = self.request.get("user")
        obj = get_poll(article_id)
        write_response(self.request, self.response, json.dumps(obj.toMap()))


class PostVoteHandler(webapp.RequestHandler):
    def get(self):

        article_id = self.request.get("article")
        choice = self.request.get("action")
        facebook_token = self.request.get("access_token")
        user_id = self.request.get("user")

        logging.info("Got vote from " + user_id + " for article " + article_id)

        if register_user_vote(article_id, user_id, choice):
            register_vote(article_id, choice)
            result = post_to_facebook(article_id, facebook_token, choice)
            write_response(self.request, self.response, result.content)
        else:
            self.response.write("Already Voted")
            self.response.set_status(400)


app = webapp.WSGIApplication([('/poll', GetVoteHandler), ('/vote', PostVoteHandler), ('/user', UserHandler)], debug=True)
