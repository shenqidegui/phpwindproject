/**
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨�û��������ǩjs����˽�š������ᵽĳ�ˣ�
 * @Author	: linhao87@gmail.com
 * @Depend	: core.js��jquery.js(1.7 or later)
 * $Id$
 */
;
(function(){
	window.userTag = function () {
		var user_tag_wrap = $('.J_user_tag_wrap');
		
		$.each(user_tag_wrap, function (i, o) {
			var $this = $(this),
				user_tag_ul = $this.find('ul.J_user_tag_ul'),
				user_tag_input = $this.find('input.J_user_tag_input'),
				timer;
			
			user_tag_input.val('');
			
			//�����������۽�
			user_tag_wrap.on('click', function (e) {
				if (e.target == $this[0]) {
					user_tag_input.focus();
				}
			});
			
			user_tag_input.on('keydown', function (e) {
				//��������
				var $this = $(this);

				if (e.keyCode === 32 || e.keyCode === 13) {
					//����ո��س�
					if(e.keyCode === 13) {
						e.preventDefault();		//mac ff�������İ��س�����ֹ
					}
					var v = $.trim($this.val());
					
					//�Ƿ��е�ǰ��
					var current = $('#J_user_match_wrap li.current');
					if(current.length) {
						v = current.text();
					}

					tagCreat(v, user_tag_ul, user_tag_input);
					
				}else if(e.keyCode === 8){
					//backspace
					if(!$.trim($this.val())) {
						user_tag_ul.children(':last').remove();
					}
				}
				
			}).on('blur', function (e) {
				//ʧ��
				var v = $.trim($(this).val());
				
				if (!v) {
					return false; //������
				}
				
				timer = setTimeout(function(){
					tagCreat(v, user_tag_ul, user_tag_input);
					$('#J_user_match_wrap').hide().empty();
				}, 100);
				
			});
			
		});
		
		//ɾ��
		$('ul.J_user_tag_ul').on('click', 'del.J_user_tag_del', function (e) {
			e.preventDefault();
			$(this).parents('li').remove();
		});
		
	};

	userTag();

	//��֤&�����û�tag
	function tagCreat(v, ul, input) {
		if(!v) {
			return false;
		}
		//��֤�û��������ַ�
		var reg = /[&\\'\"\/*,<>#%?��]/g;
		
		if (reg.test(v)) {
			Wind.Util.resultTip({
				error : true,
				msg : '���ܺ��зǷ��ַ�',
				follow : input
			});
			return;
		}
		
		//��ȡ�����ɵ��û���
		var v_arr = [];
		$.each(ul.children('li'), function (i, o) {
			v_arr.push($(this).find('.J_tag_name').text());
		});
		
		//�ظ���֤
		/*var repeat = false;
		$.each(v_arr, function (i, o) {
			if (o === v) {
				repeat = true;
			}
		});
		if (repeat) {
			return false;
		}*/
		
		//����tag
		ul.append('<li><a><span class="J_tag_name">' + v + '</span><del title="' + v + '" class="J_user_tag_del">��</del><input type="hidden" value="' + v + '" name="'+ input.data('name') +'" /></a></li>');
		
		setTimeout(function(){
			input.val('');
		}, 0);
	}

})();

