# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('timetracker', '0002_employer_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='client_name',
            field=models.CharField(max_length=200, blank=True, verbose_name='Client name'),
        ),
        migrations.AlterField(
            model_name='project',
            name='notes',
            field=models.CharField(max_length=2000, blank=True, verbose_name='Notes'),
        ),
    ]
