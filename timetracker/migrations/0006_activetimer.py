# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('timetracker', '0005_auto_20150728_0105'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActiveTimer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('hourly_wage', models.DecimalField(max_digits=5, verbose_name='Hourly wage', decimal_places=2)),
                ('datetime_start', models.DateTimeField(verbose_name='Start date and time')),
                ('summary', models.CharField(max_length=2000, verbose_name='Summary')),
                ('project', models.ForeignKey(to='timetracker.Project')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
