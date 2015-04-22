function comment(taid, post_id, appendToId)
{
	//document.write(document.getElementById(id).value);
	var cmnt_txt = document.getElementById(taid).value;
	document.getElementById(taid).value='';
	if(cmnt_txt=='')
	{
		return 0;
	}
	var postForm = {
		'comment_text': cmnt_txt,
		'post_id': post_id,
		csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value
	}
	//document.write("giiiii");
	$.ajax({
		url: '/blogs/comment/',
		type: 'POST',
		data: postForm,
		success: function(data) {
        	create_comment_box_and_appendTo("#"+appendToId, data['cmnt_by'], cmnt_txt, data['cmnt_id'], post_id, data['cmnt_time'])
    	},
    	failure: function(data) { 
    		alert('Got an error dude');
    	}
	});
}

function update(post_id)
{
	//document.write("cccc")
	//document.write(document.getElementById("p_ctnt_"+post_id).innerHTML)
	document.getElementById("updateform").style.display="block";
	document.getElementById("update-post-id").value=post_id;
	document.getElementById("update-post-text").value=document.getElementById("p_ctnt_"+post_id).innerHTML;
}

function toggle(ttid)
{
	var status = document.getElementById(ttid).style.display;
	//document.write(status)
	if (status=='none')
	{
		document.getElementById(ttid).style.display = 'block';
	}
	else
	{
		document.getElementById(ttid).style.display = 'none';	
	}
}

function toggle_reply(rply_box_id, rply_btn_id)
{
	var status = document.getElementById(rply_box_id).style.display;
	//document.write(status)
	if (status=='none')
	{
		document.getElementById(rply_box_id).style.display = 'block';
		document.getElementById(rply_btn_id).style.display = 'block';
	}
	else
	{
		document.getElementById(rply_box_id).style.display = 'none';
		document.getElementById(rply_btn_id).style.display = 'none';	
	}
}

function load_comment(btnId, postId, appendToId, toggle_btn_id)
{
	//document.getElementById(appendToId).innerHTML="loading..";
	document.getElementById(appendToId).style.display='none';
	toggle(appendToId)
	//document.getElementById(appendToId).innerHTML="loading..";
	btnId.style.display="none";
	document.getElementById(toggle_btn_id).style.display='block';
	appendToId = "#"+appendToId;
	//create_comment_box_and_appendTo(appendToId, 'dilip', 'yo its working')


	//document.write("giiiii");
	$.ajax({
		url: '/blogs/allcomments/'+postId+'/',
		type: 'GET',
		success: function(data) {
			//str = eval(data)
        	//alert(data['comments']);
        	for(var i in data['comments'])
        	{
        		var appendTo = appendToId;
        		var c_by = data['comments'][i]['by'];
        		var c_txt = data['comments'][i]['comment'];
        		var c_id = data['comments'][i]['commentId'];
        		var c_date = data['comments'][i]['c_date']
        		//document.write(c_id)
        		//appendToId = 'p1_c6'
        		if(data['comments'][i]['cOfcId'])
        		{
        			appendTo = '#c2id_'+ data['comments'][i]['cOfcId']
        			document.getElementById('c2id_'+ data['comments'][i]['cOfcId']).innerHTML="hii";
        			//document.write(appendToId)
        		}
        		create_comment_box_and_appendTo(appendTo, c_by, c_txt, c_id, postId, c_date)
        	}
    	},
    	failure: function(data) { 
    		alert('Got an error dude');
    	}
	});

}


function create_comment_box_and_appendTo(appendToId, c_by, c_txt, c_id, postId, c_date)
{
	var cmnt_box2_id = 'c2id_'+c_id;
	var ta_id = 'ta'+c_id;
	var rply_box_id="rbi"+c_id, rply_btn_id="rbti"+c_id;
	var comment_box = document.createElement("div");
	var t_comment_1 = document.createElement("div");
	var para = document.createElement("p");
	var cmnt_by = document.createElement("span");
	var date_time = document.createElement("span");
	var comnt_text = document.createElement("span");
	var c_on_c = document.createElement("div");
	var reply_btn = document.createElement("div");
	var reply_box = document.createElement("div");
	var txt_area = document.createElement("input")
	var reply_btn1 = document.createElement("div")
	var t_comment_2 = document.createElement("div");



	$(comment_box).addClass("comment")
			.appendTo($(appendToId))
	$(t_comment_1).addClass("t-comment-1")
			.appendTo($(comment_box))
	$(para).appendTo($(t_comment_1))
	$(cmnt_by).addClass("commented-by")
			.text(c_by)
			.appendTo($(para))
	//$("&nbsp;&nbsp;").appendTo($(para))
	$(date_time).addClass("date-time")
			.html("&nbsp;&nbsp;"+c_date+"<br>")
			.appendTo($(para))
	//$("<br>").appendTo($(para))
	$(comnt_text).addClass("comment-text")
			.text(c_txt)
			.appendTo($(para))
	$(c_on_c).addClass("c-on-c")
			.appendTo($(comment_box))
	$(reply_btn).addClass("reply-btn")
			.addClass("btn")
			.addClass("btn-default")
			.text("Reply...")
			.attr("onclick", "toggle_reply('"+rply_box_id+"', '"+rply_btn_id+"')")
			.appendTo($(c_on_c))
	$(reply_box).addClass("reply-box")
			.attr("id", rply_box_id)
			.css("display", "none")
			.appendTo($(c_on_c))
	$(txt_area).attr("type", "text")
			.attr("id", ta_id)
			.appendTo($(reply_box))
	$(reply_btn1).addClass("reply-btn")
			.addClass("btn")
			.addClass("btn-default")
			.attr("id", rply_btn_id)
			.css("display", "none")
			.attr("onclick", "reply('"+ta_id+"', "+postId+", "+c_id+")")
			.text("Reply")
			.appendTo($(c_on_c))
	$(t_comment_2).addClass("t-comment-2")
			.attr("id", cmnt_box2_id)
			.appendTo($(comment_box))
}


function reply(ta_id, postId, c_id)
{
	//document.write(document.getElementById(ta_id).value, postId, c_id)
	//$("#c2id_"+c_id).html="Loading...";
	
	cmnt_txt = document.getElementById(ta_id).value
	document.getElementById(ta_id).value='';
	if(cmnt_txt=='')
	{
		return 0;
	}
	//document.getElementById("c2id_"+c_id).innerHTML="<h3>Loading...</h3>";
	var postForm = {
		'comment_text': cmnt_txt,
		'post_id': postId,
		'reply_of': c_id,
		csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value
	}
	//document.write("giiiii");
	$.ajax({
		url: '/blogs/reply/',
		type: 'POST',
		data: postForm,
		success: function(data) {
			//document.getElementById("c2id_"+c_id).innerHTML="";
        	create_comment_box_and_appendTo("#c2id_"+c_id, data['cmnt_by'], cmnt_txt, data['cmnt_id'], postId, data['cmnt_time'])
    	},
    	failure: function(data) { 
    		alert('Got an error dude');
    	}
	});
}