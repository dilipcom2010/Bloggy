from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Posts(models.Model):
	title = models.CharField(max_length=160)
	content = models.TextField()
	pub_date = models.DateTimeField(auto_now_add=True, editable=False)
	mod_date = models.DateTimeField(auto_now=True)
	pub_by = models.ForeignKey(User, verbose_name="By")

class Comments(models.Model):
	post = models.ForeignKey(Posts)
	comment = models.TextField()
	comm_date = models.DateTimeField(auto_now_add=True, editable=False)
	edit_date = models.DateTimeField(auto_now=True)
	comm_by = models.ForeignKey(User, verbose_name="By")
	comment_of_comment = models.ForeignKey('self', blank=True, null=True)