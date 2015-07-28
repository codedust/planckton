from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^create/employer/', views.createEmployer, name='createEmployer'),
    url(r'^create/project/', views.createProject, name='createProject'),
]
