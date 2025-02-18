# Generated by Django 4.1.13 on 2025-01-17 02:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('email', models.CharField(db_index=True, max_length=100)),
                ('phone', models.CharField(max_length=100)),
                ('address', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=300, null=True)),
                ('position', models.CharField(max_length=300, null=True)),
                ('email', models.CharField(max_length=100, null=True)),
                ('image', models.ImageField(default='default.jpg', upload_to='images')),
                ('stage', models.CharField(choices=[('NEW', 'NEW'), ('QUALIFIED', 'QUALIFIED'), ('UNQUALIFIED', 'UNQUALIFIED'), ('WON', 'WON'), ('NEGOTIATION', 'NEGOTIATION'), ('LOST', 'LOST'), ('INTERESTED', 'INTERESTED'), ('CONTACTED', 'CONTACTED'), ('CHURNED', 'CHURNED')], default='NEW', max_length=50)),
                ('verified', models.BooleanField(default=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('content', models.TextField(null=True)),
                ('type', models.CharField(max_length=50)),
                ('link', models.TextField(null=True)),
                ('link_image', models.TextField(null=True)),
                ('date', models.DateTimeField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('completed', models.BooleanField(default=False)),
                ('users', models.ManyToManyField(to='api.profile')),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True, null=True)),
                ('expiration_date', models.DateTimeField()),
                ('image', models.ImageField(default='default.jpg', upload_to='images')),
                ('completed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('collaborative', models.ManyToManyField(to='api.profile')),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to='api.customer')),
                ('leader', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='leader', to='api.profile')),
                ('tasks', models.ManyToManyField(to='api.task')),
            ],
        ),
        migrations.CreateModel(
            name='HistoryAbsent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('content', models.TextField()),
                ('type', models.CharField(max_length=50)),
                ('date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='absent', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('content', models.TextField()),
                ('type', models.CharField(max_length=50)),
                ('date', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
