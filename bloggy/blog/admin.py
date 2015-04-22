from django.contrib import admin
from blog.models import *

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'content', 'pub_date', 'mod_date', 'pub_by')


# Register your models here.
admin.site.register(Posts, PostAdmin)
admin.site.register(Comments)