from django.conf.urls import patterns, url
from blog import views

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^publish/$', views.post_blog, name='publish'),
	url(r'^update/$', views.update_post, name='update'),
	url(r'^delete/(?P<post_id>\w+)/$', views.delete_post, name='delete'),
	url(r'^comment/$', views.post_comment, name='comment'),
	url(r'^reply/$', views.reply, name='reply'),
	url(r'^allcomments/(?P<p_id>\w+)/$', views.fetch_comment, name='allcomments'),
	
	)