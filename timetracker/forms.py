from django.forms import ModelForm

from .models import Employer, Project

class BootstrapModelForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(ModelForm, self).__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'
            field.widget.attrs['placeholder'] = field.label

class CreateEmployerForm(BootstrapModelForm):
    class Meta:
        model = Employer
        fields = ['name', 'default_hourly_wage']

class CreateProjectForm(BootstrapModelForm):
    class Meta:
        model = Project
        fields = ['employer', 'name', 'client_name', 'notes', 'default_hourly_wage']
