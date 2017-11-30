from twilio.twiml.voice_response import Play, VoiceResponse


def lambda_handler(event, context):
    """ event should have URL of order placement """
    response_body = VoiceResponse()

    response_body.play(event['queryStringParameters']['order_memo'])

    response = {
        'statusCode': 200,
        "body": str(response_body),
        'headers': {
            'Content-Type': 'application/xml'
        },
        "isBase64Encoded": False
    }

    return response