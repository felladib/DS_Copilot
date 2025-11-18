from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.validators import EmailValidator

class Company(models.Model):
    """
    Modèle pour représenter une entreprise. Chaque site est lié à une seule entreprise.
    """
    name = models.CharField(max_length=255, unique=True, help_text="Nom de l'entreprise, unique pour éviter les doublons.")
    domain = models.CharField(max_length=255, unique=True, help_text="Domaine de l'entreprise (ex. : entreprise.com), utilisé pour l'isolation du site.")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Date de création du site entreprise.")
    is_active = models.BooleanField(default=True, help_text="Indique si le site est actif (pour désactiver temporairement).")
    verification_document = models.FileField(upload_to='company_verifications/', blank=True, null=True, help_text="Document justificatif (ex. : certificat d'immatriculation) pour prouver que le créateur est bien lié à l'entreprise.")
    verification_status = models.CharField(max_length=20, choices=[('pending', 'En attente'), ('approved', 'Approuvé'), ('rejected', 'Rejeté')], default='pending', help_text="Statut de vérification pour approuver la création du site.")

    def __str__(self):
        return self.name

class User(AbstractUser):
    """
    Modèle utilisateur étendu pour différencier RH et employés.
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='users', help_text="Entreprise à laquelle l'utilisateur appartient.")
    role = models.CharField(max_length=20, choices=[('hr', 'RH'), ('employee', 'Employé')], help_text="Rôle de l'utilisateur : RH pour admin, employé pour les autres.")
    is_verified = models.BooleanField(default=False, help_text="Indique si l'utilisateur a été vérifié (via invitation ou document).")
    employee_id = models.CharField(max_length=50, blank=True, null=True, help_text="ID employé fourni par l'entreprise, pour vérification interne.")
    verification_document = models.FileField(upload_to='user_verifications/', blank=True, null=True, help_text="Document justificatif (ex. : contrat de travail) pour prouver le statut employé.")
    invited_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, help_text="Utilisateur RH qui a envoyé l'invitation.")
    date_joined_company = models.DateField(blank=True, null=True, help_text="Date d'embauche, pour organiser les tâches RH.")

    def __str__(self):
        return f"{self.username} ({self.role} chez {self.company.name})"

class Invitation(models.Model):
    """
    Modèle pour gérer les invitations d'inscription envoyées par le RH.
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE, help_text="Entreprise concernée par l'invitation.")
    invited_email = models.EmailField(validators=[EmailValidator()], help_text="Email de l'employé invité.")
    invited_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'hr'}, help_text="RH qui envoie l'invitation.")
    token = models.CharField(max_length=64, unique=True, help_text="Token unique pour sécuriser l'invitation (généré aléatoirement).")
    is_used = models.BooleanField(default=False, help_text="Indique si l'invitation a été utilisée.")
    expires_at = models.DateTimeField(default=timezone.now() + timezone.timedelta(days=7), help_text="Date d'expiration de l'invitation (ex. : 7 jours).")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Date de création de l'invitation.")

    def __str__(self):
        return f"Invitation pour {self.invited_email} chez {self.company.name}"

class Task(models.Model):
    """
    Modèle générique pour les tâches RH (ex. : onboarding, évaluation, congé).
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE, help_text="Entreprise concernée.")
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks', help_text="Utilisateur (RH ou employé) assigné à la tâche.")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks', limit_choices_to={'role': 'hr'}, help_text="RH qui a créé la tâche.")
    title = models.CharField(max_length=255, help_text="Titre de la tâche (ex. : 'Onboarding de Jean').")
    description = models.TextField(help_text="Description détaillée de la tâche.")
    due_date = models.DateField(help_text="Date d'échéance.")
    status = models.CharField(max_length=20, choices=[('pending', 'En attente'), ('in_progress', 'En cours'), ('completed', 'Terminée')], default='pending', help_text="Statut de la tâche.")
    priority = models.CharField(max_length=10, choices=[('low', 'Faible'), ('medium', 'Moyenne'), ('high', 'Élevée')], default='medium', help_text="Priorité pour organiser.")
    category = models.CharField(max_length=50, choices=[('onboarding', 'Onboarding'), ('evaluation', 'Évaluation'), ('leave', 'Congé'), ('other', 'Autre')], help_text="Catégorie pour classer les tâches RH.")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Date de création.")
    updated_at = models.DateTimeField(auto_now=True, help_text="Date de dernière mise à jour.")

    def __str__(self):
        return f"{self.title} - {self.status}"

# Modèles supplémentaires pour des tâches spécifiques (si tu veux les séparer)
class Onboarding(models.Model):
    """
    Modèle spécifique pour l'onboarding d'un employé.
    """
    task = models.OneToOneField(Task, on_delete=models.CASCADE, help_text="Tâche liée à cet onboarding.")
    employee = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'employee'}, help_text="Employé en onboarding.")
    steps = models.JSONField(help_text="Étapes d'onboarding (ex. : [{'step': 'Formation', 'completed': False}]).")
    completed_at = models.DateTimeField(blank=True, null=True, help_text="Date de fin de l'onboarding.")

    def __str__(self):
        return f"Onboarding de {self.employee.username}"


class LeaveRequest(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'employee'})
    type = models.CharField(max_length=20, choices=[('vacation', 'Vacances'), ('sick', 'Maladie'), ('other', 'Autre')])
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=[('pending', 'En attente'), ('approved', 'Approuvé'), ('rejected', 'Rejeté')], default='pending')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'hr'})
class Payroll(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'employee'})
    period = models.CharField(max_length=20, help_text="Ex. : '2023-10'")
    gross_salary = models.DecimalField(max_digits=10, decimal_places=2)
    deductions = models.DecimalField(max_digits=10, decimal_places=2)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    bonuses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payslip_file = models.FileField(upload_to='payslips/')
class Contract(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=50, choices=[('employment', 'Emploi'), ('amendment', 'Avenant')])
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    document_file = models.FileField(upload_to='contracts/')
    amendments = models.JSONField(default=list, help_text="Historique des modifications.")
class Report(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    type = models.CharField(max_length=50, choices=[('turnover', 'Turnover'), ('diversity', 'Diversité'), ('performance', 'Performance')])
    data = models.JSONField(help_text="Données du rapport en JSON.")
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'hr'})
    date = models.DateField(auto_now_add=True)