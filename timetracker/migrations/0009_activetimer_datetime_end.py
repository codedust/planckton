# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.utils.timezone import utc
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('timetracker', '0008_auto_20151025_1538'),
    ]

    operations = [
        migrations.AddField(
            model_name='activetimer',
            name='datetime_end',
            field=models.DateTimeField(verbose_name='End date and time', default=datetime.datetime(2015, 10, 25, 15, 47, 44, 658941, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
