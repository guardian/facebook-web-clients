from google.appengine.ext import webapp
from google.appengine.api import urlfetch
from google.appengine.ext import db
import json, webapp2, logging, urllib

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
                            "question": 7694,
                            "id": "agree",
                            "count": self.yesCount,
                            "label": "Agree"
                        },
                        {
                            "question": 7694,
                            "id": "disagree",
                            "count": self.noCount,
                            "label": "Disagree"
                        }
                    ]
                }
            ]
        }

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


class MainHandler(webapp.RequestHandler):
    def get(self):

        articleId = self.request.get("article")

        poll = get_poll(articleId)

        write_response(self.request, self.response, json.dumps(poll.toMap()))

    def post(self):

        articleId = self.request.get("article")
        choice = self.request.get("action")
        fbAccessToken = self.request.get("access_token")

        logging.info("Voting for: " + choice)

        form_fields = {
            "method": "post",
            "article": articleId,
            "access_token": fbAccessToken
        }

        url = "https://graph.facebook.com/me/theguardian-spike:%s" % choice

        form_data = urllib.urlencode(form_fields)
        result = urlfetch.fetch(url=url, payload=form_data, method=urlfetch.POST)

        register_vote(articleId, choice)

        write_response(self.request, self.response, result.content)

app = webapp.WSGIApplication([('/', MainHandler)], debug=True)

