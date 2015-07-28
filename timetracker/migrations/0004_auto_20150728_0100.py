# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('timetracker', '0003_auto_20150727_1845'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='name',
            field=models.CharField(max_length=200, verbose_name='Project name'),
        ),
        migrations.AlterField(
            model_name='project',
            name='notes',
            field=models.TextField(max_length=2000, verbose_name='Notes', blank=True),
        ),
    ]
