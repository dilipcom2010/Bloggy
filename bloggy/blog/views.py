from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.context_processors import csrf
from blog.models import Posts, Comments
from django.core import serializers
from annoying.decorators import ajax_request
from datetime import datetime


from forms import MyRegistrationForm

# Create your views here.
@login_required(login_url='/login/')
def index(request):
	p = Posts.objects.all().order_by('-pub_date')
	return render(request, 'home.html', {'posts': p, 'loggedIn': request.user})


@login_required(login_url='/login/')
def update_post(request):
	pst = Posts.objects.get(pk=request.POST.get('post_id'))
	if request.user.username == pst.pub_by.username:
		Posts.objects.filter(pk=request.POST.get('post_id')).update(content=request.POST.get('content'), mod_date=datetime.now())
	return HttpResponseRedirect("/blogs/")


@login_required(login_url='/login/')
def delete_post(request, post_id):
	pst = Posts.objects.get(pk=post_id)
	if request.user.username == pst.pub_by.username:
		pst.delete()
		#print "ggggggg"
		#Posts.objects.filter(pk=request.POST.get('post_id')).update(content=request.POST.get('content'), mod_date=datetime.now())
	return HttpResponseRedirect("/blogs/")


@login_required(login_url='/login/')
def post_blog(request):
	if request.method == 'POST':
		title = request.POST.get('title')
		content = request.POST.get('content')
		if title != '' and content != '':
			try:
				p = Posts(title=title, content=content, pub_by=request.user)
				p.save()
			except Exception, e:
				state = "Error in Publishing blog"
			
		else:
			state = "Title or Content should not empty"
		return HttpResponseRedirect("/blogs/")

	return render(request, 'publish_post.html')




@login_required(login_url='/login/')
@ajax_request
def post_comment(request): 
	try:
		p = Comments(post_id=request.POST.get('post_id'), comment=request.POST.get('comment_text'), comm_by=request.user)
		p.save()
	except Exception, e:
		print "Error in commenting"
	return {'cmnt_id': p.id, 'cmnt_by':request.user.username, 'cmnt_time':p.comm_date}


@login_required(login_url='/login/')
@ajax_request
def fetch_comment(request, p_id):
	print p_id
	data = Comments.objects.filter(post_id=p_id).values('id','post','comm_by__username','comment','comment_of_comment', 'comm_date')
	#data = serializers.serialize("json", x, indent=4, use_natural_foreign_keys=True)
	print data
	comments = Comments.objects.all()
	c_data = [{"comment":entry["comment"], "postId":entry["post"], "by":entry["comm_by__username"], "cOfcId":entry["comment_of_comment"], "commentId":entry["id"], "c_date":entry["comm_date"]} for entry in data]
	return {'comments': c_data}
	#return {'datax': data}



@login_required(login_url='/login/')
@ajax_request
def reply(request): 
	try:
		p = Comments(post_id=request.POST.get('post_id'), comment=request.POST.get('comment_text'), comm_by=request.user, comment_of_comment_id=request.POST.get('reply_of'))
		p.save()
	except Exception, e:
		print "unable to comment"
	return {'cmnt_id': p.id, 'cmnt_by':request.user.username, 'cmnt_time':p.comm_date}



def signup(request):
	args = {}
	if request.method == 'POST':
		form = MyRegistrationForm(request.POST)
		if form.is_valid():
			form.save()
			return HttpResponseRedirect("/blogs/")
		else:
			args['form'] = form
	else:
		args['form'] = MyRegistrationForm()	

	
	args.update(csrf(request))
	return render(request, 'signup.html', args)


def login_user(request):
	state = "Please log in below..."
	username = password = ''
	if request.POST:
		username = request.POST.get('username')
		password = request.POST.get('password')

		user = authenticate(username=username, password=password)
		if user is not None:
			if user.is_active:
				login(request, user)
				state = "You're successfully logged in!"
				return HttpResponseRedirect("/blogs/")
			else:
				state = "Your account is not active, please contact the site admin."
		else:
			state = "Your username and/or password were incorrect."
	
	return render(request, 'login.html',{'state':state, 'username': username})

def logout_view(request):
    logout(request)
    return HttpResponseRedirect("/blogs/")