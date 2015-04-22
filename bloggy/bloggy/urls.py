from django.conf.urls import patterns, include, url
import settings
#import blog

from django.contrib import admin
from blog import views
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'bloggy.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^blogs/', include('blog.urls')),
    url(r'^signup/$', views.signup, name='signup'),
	url(r'^login/$', views.login_user, name='login'),
	url(r'^logout/$', views.logout_view, name='logout'),
	(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
)
if not settings.DEBUG:
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    urlpatterns += staticfiles_urlpatterns()
