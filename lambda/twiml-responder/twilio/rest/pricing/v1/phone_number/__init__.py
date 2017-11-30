# coding=utf-8
"""
This code was generated by
\ / _    _  _|   _  _
 | (_)\/(_)(_|\/| |(/_  v1.0.0
      /       /
"""

from twilio.base.instance_resource import InstanceResource
from twilio.base.list_resource import ListResource
from twilio.base.page import Page
from twilio.rest.pricing.v1.phone_number.country import CountryList


class PhoneNumberList(ListResource):
    """  """

    def __init__(self, version):
        """
        Initialize the PhoneNumberList

        :param Version version: Version that contains the resource

        :returns: twilio.rest.pricing.v1.phone_number.PhoneNumberList
        :rtype: twilio.rest.pricing.v1.phone_number.PhoneNumberList
        """
        super(PhoneNumberList, self).__init__(version)

        # Path Solution
        self._solution = {}

        # Components
        self._countries = None

    @property
    def countries(self):
        """
        Access the countries

        :returns: twilio.rest.pricing.v1.phone_number.country.CountryList
        :rtype: twilio.rest.pricing.v1.phone_number.country.CountryList
        """
        if self._countries is None:
            self._countries = CountryList(self._version)
        return self._countries

    def __repr__(self):
        """
        Provide a friendly representation

        :returns: Machine friendly representation
        :rtype: str
        """
        return '<Twilio.Pricing.V1.PhoneNumberList>'


class PhoneNumberPage(Page):
    """  """

    def __init__(self, version, response, solution):
        """
        Initialize the PhoneNumberPage

        :param Version version: Version that contains the resource
        :param Response response: Response from the API

        :returns: twilio.rest.pricing.v1.phone_number.PhoneNumberPage
        :rtype: twilio.rest.pricing.v1.phone_number.PhoneNumberPage
        """
        super(PhoneNumberPage, self).__init__(version, response)

        # Path Solution
        self._solution = solution

    def get_instance(self, payload):
        """
        Build an instance of PhoneNumberInstance

        :param dict payload: Payload response from the API

        :returns: twilio.rest.pricing.v1.phone_number.PhoneNumberInstance
        :rtype: twilio.rest.pricing.v1.phone_number.PhoneNumberInstance
        """
        return PhoneNumberInstance(self._version, payload)

    def __repr__(self):
        """
        Provide a friendly representation

        :returns: Machine friendly representation
        :rtype: str
        """
        return '<Twilio.Pricing.V1.PhoneNumberPage>'


class PhoneNumberInstance(InstanceResource):
    """  """

    def __init__(self, version, payload):
        """
        Initialize the PhoneNumberInstance

        :returns: twilio.rest.pricing.v1.phone_number.PhoneNumberInstance
        :rtype: twilio.rest.pricing.v1.phone_number.PhoneNumberInstance
        """
        super(PhoneNumberInstance, self).__init__(version)

        # Marshaled Properties
        self._properties = {'name': payload['name'], 'url': payload['url'], 'links': payload['links']}

        # Context
        self._context = None
        self._solution = {}

    @property
    def name(self):
        """
        :returns: The name
        :rtype: unicode
        """
        return self._properties['name']

    @property
    def url(self):
        """
        :returns: The url
        :rtype: unicode
        """
        return self._properties['url']

    @property
    def links(self):
        """
        :returns: The links
        :rtype: unicode
        """
        return self._properties['links']

    def __repr__(self):
        """
        Provide a friendly representation

        :returns: Machine friendly representation
        :rtype: str
        """
        return '<Twilio.Pricing.V1.PhoneNumberInstance>'
