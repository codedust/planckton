# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Employer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('name', models.CharField(max_length=200, verbose_name='Name')),
                ('default_hourly_wage', models.DecimalField(decimal_places=2, verbose_name='Default hourly wage', max_digits=5)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('name', models.CharField(max_length=200, verbose_name='Name')),
                ('client_name', models.CharField(max_length=200, verbose_name='Client name')),
                ('notes', models.CharField(max_length=2000, verbose_name='Notes')),
                ('default_hourly_wage', models.DecimalField(decimal_places=2, verbose_name='Default hourly wage', max_digits=5)),
                ('employer', models.ForeignKey(to='timetracker.Employer')),
            ],
        ),
        migrations.CreateModel(
            name='Timeframe',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('hourly_wage', models.DecimalField(decimal_places=2, verbose_name='Hourly wage', max_digits=5)),
                ('datetime_start', models.DateTimeField(verbose_name='Start date and time')),
                ('datetime_end', models.DateTimeField(verbose_name='End date and time')),
                ('summary', models.CharField(max_length=2000, verbose_name='Summary')),
                ('project', models.ForeignKey(to='timetracker.Project')),
            ],
        ),
    ]
