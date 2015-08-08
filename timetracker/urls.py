from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^employer/create/', views.create_employer, name='create_employer'),
    url(r'^employer/edit/(?P<employer_id>[0-9]+)/', views.edit_employer, name='edit_employer'),
    url(r'^project/create/(?P<employer_id>[0-9]+)/', views.create_project, name='create_project'),
    url(r'^project/edit/(?P<project_id>[0-9]+)/', views.edit_project, name='edit_project'),
    url(r'^project/show/(?P<project_id>[0-9]+)/', views.show_project, name='show_project'),
]
