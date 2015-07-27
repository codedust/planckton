from django.shortcuts import render
from django.views import generic

from .models import Employer, Project, Timeframe

class IndexView(generic.ListView):
    template_name = 'timetracker/index.html'
    queryset = Employer
