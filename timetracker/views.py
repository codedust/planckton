from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render

from .forms import CreateEmployerForm, CreateProjectForm
from .models import Employer, Project, Timeframe

def index(request):
    if not request.user.is_authenticated():
        return render(request, 'timetracker/index_nologin.html', {})

    return render(request, 'timetracker/index.html', {
        'employer_list': Employer.objects.all(),
        'create_employer_form': CreateEmployerForm(),
        'create_project_form': CreateProjectForm(),
    })

@login_required
def createEmployer(request):
    if not request.user.is_authenticated():
        return render(request, 'timetracker/index_nologin.html', {})

    if request.method == "POST":
        new_employer = Employer(user=request.user)
        create_employer_form = CreateEmployerForm(request.POST, instance=new_employer)
        if create_employer_form.is_valid():
            create_employer_form.save()
            return HttpResponseRedirect(reverse('timetracker:index'))
    else:
        create_employer_form = CreateEmployerForm()

    return render(request, 'timetracker/createEmployer.html', {
        'create_employer_form': create_employer_form,
    })

@login_required
def createProject(request):
    if request.method == "POST":
        new_project = Project(user=request.user)
        create_project_form = CreateProjectForm(request.POST, instance=new_project)
        if create_project_form.is_valid():
                create_project_form.save()
                return HttpResponseRedirect(reverse('timetracker:index'))
    else:
        create_project_form = CreateProjectForm()

    return render(request, 'timetracker/createProject.html', {
        'create_project_form': create_project_form,
    })
