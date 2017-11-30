import boto3
import datetime
import calendar
import requests


def lambda_handler(event, context):
    """
    :param event:
      restaurant:
        name: <something>
      delivery:
        name: <name>
        address: <address>
      order:
        - item:
            name: <some name>
            quantity: <quantity>
    :param context:
    :return:
    """
    memo_location = generate_voice_memo(
        name=event['delivery']['name'],
        order_data=event['order'],
        payment_info=event['payment'],
        delivery_info=event['delivery']['address']
    )

    # send to memo
    requests.get('https://hgwx8w7r64.execute-api.us-east-1.amazonaws.com/prod/eat-up-call-connector', params={
        'to_number': '+15182818509',
        'order_memo': 'https://s3.amazonaws.com/eat-up-recordings/%s' % memo_location
    })

    return 'memo created and saved to %s' % memo_location


def generate_voice_memo(name=None, order_data=None, payment_info=None, delivery_info=None):
    """ given a restaurant name and order data (list), create a voice transcription with polly, then save that to S3 """
    def format_order():
        return ', '.join(['%s %s' % (item['quantity'], item['name']) for item in order_data])

    def format_payment():
        return '%s, card number %s, card expiration %s, and card CVC %s' % (
            name, payment_info['number'], payment_info['expiration'], payment_info['cvc']
        )

    def format_delivery():
        return '%s at %s' % (name, delivery_info)

    template = "Hello, this is Alexa. I am placing an order on behalf of %s for %s. Please charge the order to %s. Please deliver the order to %s. Thank You." % (
        name, format_order(), format_payment(), format_delivery()
    )

    polly = boto3.client('polly')

    response = polly.synthesize_speech(
        OutputFormat='mp3',
        VoiceId='Nicole',
        Text=template
    )

    s3 = boto3.resource('s3')
    bucket = s3.Bucket('eat-up-recordings')

    filename = '%s-recording-%s.mp3' % (name.replace(' ', '-'), timestamp())
    bucket.upload_fileobj(response['AudioStream'], filename, {'ContentType': 'audio/mpeg'})

    return filename


def timestamp():
    dt = datetime.datetime.utcnow()
    return calendar.timegm(dt.utctimetuple())
