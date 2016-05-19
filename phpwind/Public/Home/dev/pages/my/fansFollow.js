/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-��ע��˿
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), global.js, URL_UNFOLLOW, URL_FOLLOW
 * $Id$
 */

;(function(){
	var friends_items = $('.J_friends_items');
/*
 * ��ʾ����ȡ����ע
*/
	var unfollow_btn = $('a.J_unfollow_btn');
	friends_items.hover(function(){
		$(this).find('a.J_unfollow_btn').fadeIn('fast');
	}, function(){
		$(this).find('a.J_unfollow_btn').fadeOut('fast');
	});


/*
 * ��ע&ȡ����ע���ҵķ�˿ ���� ��ӡ
*/
	var lock = false;
	friends_items.on('click', 'a.J_fans_follow', function(e){
		e.preventDefault();
		var $this = $(this),
				role = $this.data('role'),
				uid = $this.data('uid'),
				followed = $this.data('followed'),
				followed_attr = followed ? 'data-followed="true"' : '',		//�ѹ�ע��ʶ
				url = (role == 'follow' ? URL_FOLLOW : URL_UNFOLLOW);			//�ύ��ַ

		//global.js
		Wind.Util.ajaxMaskShow();

		//����
		if(lock) {
			return false;
		}
		lock = true;

		$.post(url, {uid : uid} ,function(data){
			//global.js
			Wind.Util.ajaxMaskRemove();
			lock = false;

			if(data.state == 'success') {
				var parent = $this.parent();
				if(role == 'follow') {
					//��ע
					if(followed) {
						//�Է��ѹ�ע
						parent.html('<span title="�����ע" class="mnfollow">�����ע</span><a class="core_unfollow J_unfollow_btn J_fans_follow" '+ followed_attr +' data-role="unfollow" data-uid="'+ uid +'" href="#">ȡ����ע</a>');
					}else{
						parent.html('<a class="core_unfollow J_fans_follow J_unfollow_btn" data-role="unfollow" data-uid="'+ uid +'" href="#">ȡ����ע</a>');
					}
				}else{
					//ȡ����ע
					parent.html('<a class="core_follow J_fans_follow" data-role="follow" '+ followed_attr +' data-uid="'+ uid +'" href="#">�ӹ�ע</a>');
				}

				$('#J_user_card_'+ uid).remove();
				
			}else if(data.state == 'fail'){
				//global.js
				Wind.Util.resultTip({
					error : true,
					msg : data.message,
					follow : $this
				});
			}
		}, 'json');
	});

})();