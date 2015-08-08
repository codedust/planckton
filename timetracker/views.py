from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render

from .forms import EmployerForm, ProjectForm, DeleteForm
from .models import Employer, Project, Timeframe

def index(request):
    if not request.user.is_authenticated():
        return render(request, 'timetracker/index_nologin.html', {})

    if request.method == "POST":
        if request.POST.get('action', '') == 'delete_employer':
            delete_form = DeleteForm(request.POST)
            if delete_form.is_valid():
                employer = get_object_or_404(Employer, pk=delete_form.cleaned_data['id'], user=request.user)
                employer.delete()

        elif request.POST.get('action', '') == 'delete_project':
            delete_form = DeleteForm(request.POST)
            if delete_form.is_valid():
                project = get_object_or_404(Project, pk=delete_form.cleaned_data['id'], user=request.user)
                project.delete()

    return render(request, 'timetracker/index.html', {
        'employer_list': Employer.objects.filter(user=request.user)
    })

@login_required
def create_employer(request):
    if request.method == "POST":
        new_employer = Employer(user=request.user)
        create_employer_form = EmployerForm(request.POST, instance=new_employer)
        if create_employer_form.is_valid():
            create_employer_form.save()
            return HttpResponseRedirect(reverse('timetracker:index'))
    else:
        create_employer_form = EmployerForm()

    return render(request, 'timetracker/create_employer.html', {
        'form': create_employer_form,
    })

@login_required
def edit_employer(request, employer_id):
    employer = get_object_or_404(Employer, pk=employer_id, user=request.user)

    if request.method == "POST":
        edit_employer_form = EmployerForm(request.POST, instance=employer)
        if edit_employer_form.is_valid():
            edit_employer_form.save()
            return HttpResponseRedirect(reverse('timetracker:index'))
    else:
        edit_employer_form = EmployerForm(instance=employer)

    return render(request, 'timetracker/edit_employer.html', {
        'form': edit_employer_form,
    })

@login_required
def create_project(request, employer_id):
    if request.method == "POST":
        new_project = Project(user=request.user)
        create_project_form = ProjectForm(request.POST, instance=new_project)
        if create_project_form.is_valid():
            create_project_form.save()
            return HttpResponseRedirect(reverse('timetracker:index'))
    else:
        employer = get_object_or_404(Employer, pk=employer_id, user=request.user)
        new_project = Project(employer=employer, user=request.user, default_hourly_wage=employer.default_hourly_wage)
        create_project_form = ProjectForm(instance=new_project)

    return render(request, 'timetracker/create_project.html', {
        'form': create_project_form,
    })

@login_required
def edit_project(request, project_id):
    project = get_object_or_404(Project, pk=project_id, user=request.user)

    if request.method == "POST":
        edit_project_form = ProjectForm(request.POST, instance=project)
        if edit_project_form.is_valid():
                edit_project_form.save()
                return HttpResponseRedirect(reverse('timetracker:index'))
    else:
        edit_project_form = ProjectForm(instance=project)

    return render(request, 'timetracker/edit_project.html', {
        'form': edit_project_form,
    })

@login_required
def show_project(request, project_id):
    project = get_object_or_404(Project, pk=project_id, user=request.user)

    return render(request, 'timetracker/show_project.html', {
        'project': project,
    })
