from django import forms
from django.forms import ModelForm

from .models import Employer, Project, Timeframe, ActiveTimer

class BootstrapModelForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(ModelForm, self).__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'
            field.widget.attrs['placeholder'] = field.label

class EmployerForm(BootstrapModelForm):
    class Meta:
        model = Employer
        fields = ['name', 'default_hourly_wage']

class ProjectForm(BootstrapModelForm):
    class Meta:
        model = Project
        fields = ['employer', 'name', 'client_name', 'notes', 'default_hourly_wage']

    def __init__(self, *args, **kwargs):
        super(ProjectForm, self).__init__(*args, **kwargs)
        self.fields['employer'].queryset = Employer.objects.filter(user=self.instance.user)

class ActiveTimerForm(ModelForm):
    class Meta:
        model = ActiveTimer
        fields = ['project', 'state', 'hourly_wage', 'datetime_start', 'datetime_end', 'summary']

class TimeframeForm(ModelForm):
    class Meta:
        model = Timeframe
        fields = ['hourly_wage', 'datetime_start', 'datetime_end', 'summary']

class DeleteForm(forms.Form):
    id = forms.IntegerField()
