from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.core.urlresolvers import reverse
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render, redirect

from .forms import EmployerForm, ProjectForm, TimeframeForm, ActiveTimerForm, DeleteForm
from .models import Employer, Project, Timeframe, ActiveTimer


def logout_view(request):
    logout(request)
    return redirect('/')


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
        'employer_set': Employer.objects.filter(user=request.user)
    })


def api(request):
    if not request.user.is_authenticated():
        return JsonResponse({'error': 'login_required'}, status=403)

    if request.method == "POST":
        if request.POST.get('action', '') == 'set_timer_status':
            # start a new timer
            try:
                project = Project.objects.get(pk=request.POST.get('project', -1), user=request.user)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'project_does_not_exist'})

            try:
                timer = ActiveTimer.objects.get(user=request.user, project=project)
            except ObjectDoesNotExist:
                timer = ActiveTimer(user=request.user, project=project)

            active_timer_form = ActiveTimerForm(request.POST, instance=timer)

            if active_timer_form.is_valid():
                active_timer_form.save()
            else:
                return JsonResponse({'error': 'invalid_data'}, status=200)

            return JsonResponse({'success': True}, status=200)

        if request.POST.get('action', '') == 'get_timer_status':
            # return the status of the timer for a given project
            try:
                timer = ActiveTimer.objects.get(user=request.user, project=request.POST.get('project', -1))
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'timer_does_not_exist'})

            return JsonResponse({
                'success': True,
                'state': timer.state,
                'hourly_wage': timer.hourly_wage,
                'datetime_start': timer.datetime_start,
                'datetime_end': timer.datetime_end,
                'summary': timer.summary,
            }, status=200)

        elif request.POST.get('action', '') == 'change_timeframe':
            # TODO update a previous timeframe
            return JsonResponse({'error': 'unknown_request'}, status=501)

    return JsonResponse({'error': 'unknown_request'}, status=501)


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

    if request.method == "POST":
        if request.POST.get('action', '') == 'add_timeframe':
            new_timeframe = Timeframe(user=request.user, project=project)
            add_form = TimeframeForm(request.POST, instance=new_timeframe)
            if add_form.is_valid():
                add_form.save()
                ActiveTimer.objects.filter(user=request.user, project=project).delete()


        if request.POST.get('action', '') == 'delete_timeframe':
            delete_form = DeleteForm(request.POST)
            if delete_form.is_valid():
                timeframe = get_object_or_404(Timeframe, pk=delete_form.cleaned_data['id'], user=request.user)
                timeframe.delete()

    return render(request, 'timetracker/show_project.html', {
        'project': project,
        'timeframe_set': Timeframe.objects.filter(user=request.user, project=project),
        'employer_set': Employer.objects.filter(user=request.user),
    })
