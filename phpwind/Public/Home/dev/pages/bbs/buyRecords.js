/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-���������¼
 * @Author	: linhao87@gmail.com, TID
 * @Depend	: jquery.js(1.7 or later), global.js
 * $Id$
 */


;(function(){
	
	var read_buy = $('#J_read_buy'),
		buy_count = $('#J_buy_count'),						//����ͳ��
		post_attach = $('#J_post_attach'),				//����
		attach_buy = $('#J_attach_buy'),					//��������
		buy_pop_tpl = '<div id="J_buy_pop" class="core_pop_wrap J_buyrecords_pop" style="display:none;">\
		<div style="width:250px;"><div class="core_pop">\
			<div class="pop_top J_drag_handle"><a href="" class="pop_close J_buy_close">�ر�</a><strong>��ʾ</strong></div>\
			<div class="pop_cont">_MSG</div>\
			<div class="pop_bottom">\
				<button type="submit" class="btn btn_submit J_buy_sub">ȷ��</button>\
				<button type="button" class="btn J_buy_close">ȡ��</button>\
			</div>\
		</div></div>\
	</div>',
		records_pop_tpl = '<div id="J_records_pop" class="core_pop_wrap J_buyrecords_pop" style="display:none;width:400px;">\
			<div class="core_pop">\
				<div class="pop_top J_drag_handle">\
					<a href="#" class="pop_close J_records_close">�ر�</a>\
					<strong>���������¼</strong>\
				</div>\
				<div class="p10">\
					<table class="pop_design_tablelist mb10">\
						<thead>\
							<tr>\
								<td width="120">�û���</td>\
								<td width="120">���</td>\
								<td>����ʱ��</td>\
							</tr>\
						</thead>\
						<tbody id="J_records_list"><tr><td colspan="3"><div class="pop_loading"></div></td></tr></tbody>\
					</table>\
					<div id="J_record_page" class="pages" style="display:none;"></div>\
				</div>\
				<div class="pop_bottom">\
					<button type="button" class="btn J_records_close">�ر�</button>\
				</div>\
			</div>\
		</div>';

	//����post�ύ ���ظ���
	var form = document.createElement('form'),
		$form = $(form);
	form.method = "post";
	$form.append('<input type="hidden" name="csrf_token" value="'+ GV.TOKEN +'"/><input type="hidden" name="submit" value="1"/><input id="J_a_sub" type="submit" value="11">').hide();

	//�鿴�����¼
	$('a.J_buy_record').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			records_pop = $('#J_records_pop');

		$('#J_buy_pop').remove();
		$('#J_records_pop').remove();

		Wind.Util.ajaxMaskShow();

		$.getJSON(this.href)
		.done(function(data){
			Wind.Util.ajaxMaskRemove();
			if(data.state == 'success') {
				$('body').append(records_pop_tpl);

				var records_pop = $('#J_records_pop');

				Wind.use('draggable', function(){
					records_pop.draggable( { handle : '.J_drag_handle'} );
				});

				//�ر�
				$('.J_records_close').on('click', function(e){
					e.preventDefault();
					$('#J_records_pop').hide();
				});

				var _data = data['data']['data'],
					currentpage = data['data']['page'],
					totalpage = data['data']['totalpage'];

				if(_data) {
					var record_arr = [];
					for(i=0,len=_data.length; i<len; i++) {
						record_arr.push('<tr><td><a target="_blank" href="'+ GV.U_CENTER + '&uid=' + _data[i]['uid'] +'">'+ _data[i]['username'] +'</a></td><td>'+ _data[i]['cost'] + _data[i]['ctype'] +'</td><td>'+ _data[i]['created_time'] +'</td></tr>');
					}
					$('#J_records_list').html(record_arr.join(''));
					buyPopPos($this, records_pop);

					showPages(totalpage, currentpage);

					pagesRedirect($this.data('aid'), $this.attr('href'), totalpage);
				}else{
					records_pop.remove();
				}
			}else if(data.state == 'fail'){
				Wind.Util.resultTip({
					error : true,
					follow : $this,
					msg : data.message
				});
			}
		});

	});
	
	//��ʾ��ҳ
	function showPages(currentpage, totalpage){
		var page_arr = [],
			record_page = $('#J_record_page');

		record_page.hide();
		if(totalpage<=1) {
			return;
		}
		for(i=1; i<=totalpage; i++) {
			var cls = '';
			if(i == (currentpage-1)) {
				cls = ' current';
			}
			page_arr.push('<a href="" class="J_page_item'+ cls +'">'+ i +'</a>');
		}
		record_page.html(page_arr.join('')).show();
		
	}
	
	//��¼��ҳ
	function pagesRedirect(aid, url, totalpage){
		var records_list = $('#J_records_list');

		$('a.J_page_item').on('click', function(e){
			e.preventDefault();
			var $this = $(this);
			if($this.hasClass('current')) {
				return false;
			}else{
				$this.addClass('current').siblings().removeClass('current');
			}

			records_list.html('<tr><td colspan="3"><div class="pop_loading"></div></td></tr>');
			$.post(url, {
				aid : aid,
				page : $this.text()
			}, function(data){
				if(data.state == 'success') {
					var _data = data['data']['data'];

					if(_data) {
						var record_arr = [];
						for(i=0,len=_data.length; i<len; i++) {
							record_arr.push('<tr><td><a target="_blank" href="'+ GV.U_CENTER + '&uid=' + _data[i]['uid'] +'">'+ _data[i]['username'] +'</a></td><td>'+ _data[i]['cost'] + _data[i]['ctype'] +'</td><td>'+ _data[i]['created_time'] +'</td></tr>')
						}
						records_list.html(record_arr.join(''));
					}
				}else if(data.state == 'fail'){
					$('#J_records_pop').remove();
					Wind.Util.resultTip({
						error : true,
						follow : $this,
						msg : data.message
					});
				}
			}, 'json');
		});
	}


	//����_������
	$('a.J_post_buy').on('click', function(e){
		e.preventDefault();
		var $this = $(this);

		$('#J_records_pop').remove();
		$('#J_buy_pop').remove();

		if(!GV.U_ID) {
			return;
		}


		Wind.Util.ajaxMaskShow();
		$.post(this.href, function(data){
			Wind.Util.ajaxMaskRemove();
			if(data.state == 'success') {
				$('body').append(buy_pop_tpl.replace('_MSG', data.message));
				var buy_pop = $('#J_buy_pop'),
					buy_sub = buy_pop.find('button.J_buy_sub');

				Wind.use('draggable', function(){
					buy_pop.draggable( { handle : '.J_drag_handle'} );
				});

				//�ر�
				$('.J_buy_close').on('click', function(e){
					e.preventDefault();
					$('#J_buy_pop').hide();
				});

				buyPopPos($this, buy_pop);
				
				buy_sub.on('click', function(e){
					e.preventDefault();

					Wind.Util.ajaxMaskShow();
					$.post($this.attr('href'), {
						'submit': '1'
					}, function(data){
						Wind.Util.ajaxMaskRemove();
						if(data.state == 'success') {
							var floorid = $this.parents('.J_read_floor').attr('id');
							if(floorid !== 'read_0') {
								//�ظ�ˢ�£�ê�㲻��ת
								location.reload();
							}else{
								//��¥��ת
								location.href = decodeURIComponent(data.referer);
							}
						}else if(data.state == 'fail'){
							Wind.Util.resultTip({
								error : true,
								follow : $this,
								msg : data.message
							});
						}
					}, 'json');
				});
			}else if(data.state == 'fail') {
				Wind.Util.resultTip({
					error : true,
					follow : $this,
					msg : data.message
				});
			}
		},'json');
		
	});

	//��������
	post_attach.on('click', function(e){
		e.preventDefault();
		if($(this).data('cost')) {
			attach_buy.click();
		}else{
			location.href = this.href;
		}
	});

	//����ĸ���
	$('a.J_post_attachs').each(function(){
		var item = $(this);
		Wind.Util.hoverToggle({
			elem : item,
			list : $('#J_attach_post_info_'+ item.data('id')),
			callback : function(elem, list) {
				list.css({
					left : elem.offset().left,
					top : elem.offset().top + elem.height()
				});
			}
		});
	});

	//������븽������������ʾ
	$('a.J_post_attachs').on('click', function(e){
		e.preventDefault();
		$('#J_attach_post_info_'+$(this).data('id')).find('a.J_attach_post_buy').click();
	});

	//����_����
	$('a.J_attach_post_buy').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			follow = $this,
			countrel = $($this.data('countrel'));	//ͳ��

		if($this.data('bought')) {
			//�ѹ���
			aFormSub($this.attr('href'));
			countrel.text(parseInt(countrel[0].innerHTML)+1);
			return false;
		}

		var insertid = $this.data('insertid');
		if(insertid) {
			follow = $('#J_attach_post_info_' +insertid).siblings('a.J_post_attachs');
		}

		$('#J_records_pop').remove();
		$('#J_buy_pop').remove();

		Wind.Util.ajaxMaskShow();
		$.post(this.href, function(data){
			Wind.Util.ajaxMaskRemove();
			if(data.state == 'success') {
				$('body').append(buy_pop_tpl.replace('_MSG', data.message));
				var buy_pop = $('#J_buy_pop'),
					buy_sub = buy_pop.find('button.J_buy_sub');

				Wind.use('draggable', function(){
					buy_pop.draggable( { handle : '.J_drag_handle'} );
				});

				//�ر�
				$('.J_buy_close').on('click', function(e){
					e.preventDefault();
					$('#J_buy_pop').hide();
				});

				buyPopPos(follow, buy_pop);
				
				buy_sub.on('click', function(e){
					e.preventDefault();

					aFormSub($this.attr('href'));

					buy_pop.remove();
					
					countrel.text(parseInt(countrel[0].innerHTML)+1);
					$this.data('bought', true);
				});
			}else if(data.state == 'fail') {
				if(data.message.indexOf('δ��¼') >= 0) {
					//��ݵ�¼
					Wind.Util.quickLogin();
				}else{
					Wind.Util.resultTip({
						error : true,
						follow : $this,
						msg : data.message
					});
				}
				
			}
		},'json');
	});

	//ɾ������
	$('a.J_attach_post_del').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			rel = $($this.data('rel'));

		Wind.Util.ajaxConfirm({
			href : this.href,
			elem : $this,
			callback : function(){
				rel.fadeOut(function(){
					$(this).remove();
				});
			}
		});
	});
	
	//������λ
	function buyPopPos(elem, wrap){
		var wrap_width = wrap.outerWidth(),
			elem_of_left = elem.offset().left,
			win_width = $(window).width(),
			left,
			top;

		if(elem_of_left < 5) {
			//����Ƴ������
			left =  (win_width - wrap_width)/2;
			top =  ($(window).height() - wrap.outerHeight())/2 + $(document).scrollTop();
		}else{
			if(elem_of_left + wrap_width > win_width) {
				left = win_width - wrap_width;
			}else{
				left = elem_of_left;
			}
			top = elem.offset().top + elem.height();
		}
		
		wrap.css({
			top : top,
			left : left,
			position : 'absolute',
			zIndex : 10
		}).show();
	}

	//ͨ��form post�ύ���õ��˹ؼ��� submit��ֻ�ܰ�ťclick
	function aFormSub(href){
		$form.attr('action', href).appendTo('body');
		$('#J_a_sub').click();
		$(form).remove();
	}

})();