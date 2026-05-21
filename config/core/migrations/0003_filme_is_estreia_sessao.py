from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_filme_nota_filme_poster'),
    ]

    operations = [
        migrations.AddField(
            model_name='filme',
            name='is_estreia',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='Sessao',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('horario', models.DateTimeField()),
                ('sala', models.CharField(default='Sala 1', max_length=50)),
                ('data_cadastro', models.DateTimeField(auto_now_add=True)),
                ('filme', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sessoes', to='core.filme')),
            ],
            options={
                'ordering': ['horario'],
            },
        ),
    ]
