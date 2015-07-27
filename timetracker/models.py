from django.db import models

class Employer(models.Model):
    """
    The employer you work for (e.g. 'Planckton IT Solutions').
    Each project belongs to exactly one employer.

    The default_hourly_wage is only used when there is no default_hourly_wage
    set for the corresponding Project and the Timeframe.
    """
    name = models.CharField('Name', max_length=200)
    default_hourly_wage = models.DecimalField('Default hourly wage', max_digits=5, decimal_places=2)

class Project(models.Model):
    """
    A project might be something like 'Website for company X'.
    Each project also contains some meta-data such as the name of the client
    who pays your employer (who (hopefully) then pays you).
    """
    employer = models.ForeignKey(Employer)
    name = models.CharField('Name', max_length=200)
    client_name = models.CharField('Client name', max_length=200)
    notes = models.CharField('Notes', max_length=2000)
    default_hourly_wage = models.DecimalField('Default hourly wage', max_digits=5, decimal_places=2)

class Timeframe(models.Model):
    """
    A timeframe is the time you spend working on a project without interuption.
    The might be many timeframes for a single project.
    """
    project = models.ForeignKey(Project)
    hourly_wage = models.DecimalField('Hourly wage', max_digits=5, decimal_places=2)
    datetime_start = models.DateTimeField('Start date and time')
    datetime_end = models.DateTimeField('End date and time')
    summary = models.CharField('Summary', max_length=2000)
