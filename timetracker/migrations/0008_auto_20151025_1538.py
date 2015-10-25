# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('timetracker', '0007_activetimer_state'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='activetimer',
            name='id',
        ),
        migrations.AlterField(
            model_name='activetimer',
            name='project',
            field=models.ForeignKey(to='timetracker.Project', serialize=False, primary_key=True),
        ),
        migrations.AlterField(
            model_name='activetimer',
            name='state',
            field=models.PositiveSmallIntegerField(choices=[(0, 'TIMER_NOT_RUNNING'), (1, 'TIMER_RUNNING'), (2, 'TIMER_UNSAVED')]),
        ),
    ]
