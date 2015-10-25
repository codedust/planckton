# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('timetracker', '0006_activetimer'),
    ]

    operations = [
        migrations.AddField(
            model_name='activetimer',
            name='state',
            field=models.PositiveSmallIntegerField(default=1, choices=[(1, 'TIMER_RUNNING'), (2, 'TIMER_UNSAVED')]),
            preserve_default=False,
        ),
    ]
