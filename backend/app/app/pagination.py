
from collections import OrderedDict
from urllib import parse

from rest_framework import pagination
from rest_framework.response import Response


class DefaultCursorPagination(pagination.CursorPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    cursor_query_param = 'c'
    ordering = '-created_at'

    def get_next_cursor_value(self):
        url = self.get_next_link()
        if url:
            query_param_dict = dict(parse.parse_qsl(parse.urlsplit(url).query))
            if self.cursor_query_param in query_param_dict:
                return query_param_dict[self.cursor_query_param]
        return None

    def get_previous_cursor_value(self):
        url = self.get_previous_link()
        if url:
            query_param_dict = dict(parse.parse_qsl(parse.urlsplit(url).query))
            if self.cursor_query_param in query_param_dict:
                return query_param_dict[self.cursor_query_param]
        return None

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('next_c', self.get_next_cursor_value()),
            ('previous_c', self.get_previous_cursor_value()),
            ('detail', data)
        ]))
