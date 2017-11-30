# Download the Python helper library from twilio.com/docs/python/install
from twilio.rest import Client
import os


def lambda_handler(event, context):
    """ event should include the url to the voice memo """
    # Your Account Sid and Auth Token from twilio.com/user/account
    account_sid = os.environ['ACCOUNT_SID']
    auth_token = os.environ['ACCOUNT_AUTH_TOKEN']
    client = Client(account_sid, auth_token)

    call = client.calls.create(
        to=event['queryStringParameters']['to_number'],
        from_="+12548457678",
        url="https://hgwx8w7r64.execute-api.us-east-1.amazonaws.com/prod/eat-up-twiml-responder?order_memo=%s" % event['queryStringParameters']['order_memo']
    )

    return {
        'statusCode': 200,
        "body": 'call placed',
        "isBase64Encoded": False
    }