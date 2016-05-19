/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-���ٷ���
 * @Author	: linhao87@gmail.com, TID
 * @Depend	: jquery.js(1.7 or later), global.js
 * $Id$
 */


;(function(){
	//���ٷ���
	var fresh_post_wrap = $('#J_fresh_post_wrap'),														//���ٷ�������
		fresh_post_ta = $('#J_fresh_post_ta'),																//Ĭ����ʾ�������
		fresh_post_op = $('#J_fresh_post_op'),																//��������
		fresh_post_sub = $('#J_fresh_post_sub'),															//������ť
		fresh_forum_btn = $('#J_fresh_forum_btn'),														//ѡ���鰴ť
		fresh_post_forum_wrap = $('#J_fresh_post_forum_wrap'),								//������鴰
		fresh_upload_queue = $('#J_fresh_upload_queue'),											//����
		fresh_post_fid = $('#J_fresh_post_fid'),															//����ύ��
		cateforum_json = '',																									//���json���� 
		fresh_cate = $('#J_fresh_cate'),																			//�������_�����б�
		fresh_forum = $('#J_fresh_forum'),																		//�������_����б�
		fresh_post_to_forum = $('#J_fresh_post_to_forum'),										//������-���
		fresh_post_pop_close = $('#J_fresh_post_pop_close'),									//ȷ����ť
		lock = false;

	var swfu;

	var feed_lists = $('#J_feed_lists');
	
	//���������
	fresh_post_ta.on('click', function(){
		$(this).attr('style', '').addClass('textarea').removeAttr('placeholder');
		fresh_post_op.fadeIn('fast');
		
		if(!cateforum_json) {
			//��ȡ������json
			$.post(FORUM_LIST, {
				'withMyforum' : 1
			}, function(data){
				if(data.state == 'success') {
					cateforum_json = data.data;
				}
			}, 'json');
		}

		if(!swfu) {
			swfHandle();
		}
		
	});

	//���ѡ��
	Wind.Util.clickToggle({
		elem : fresh_forum_btn,
		list : fresh_post_forum_wrap,
		callback : function(){
			if(!fresh_cate.children().length) {
				//��û��д���б�����
				try {
				
					//ѭ��д������б�
					var cate_arr = [];
					$.each(cateforum_json.cate, function(i, o){
						cate_arr.push('<li class="J_fresh_cate_item" data-fid="'+ o[0] +'">'+ o[1] +'</li>');
					});
					fresh_cate.html(cate_arr.join(''));
				}catch(e) {
					$.error(e);
				};
			}
		}
	});

	//�رհ��
	$('#J_fresh_forum_close').on('click', function(e){
		e.preventDefault();
		fresh_post_forum_wrap.hide();
	});
	
	//�������
	fresh_cate.on('click', 'li.J_fresh_cate_item', function(){
		var current_fid = $(this).data('fid');

		$(this).addClass('current').siblings('.current').removeClass('current');
		fresh_post_to_forum.text('');	//���м_���
		fresh_post_pop_close.addClass('disabled').prop('disabled', 'disabled');		//ȷ����ť������
		try {
			//ѭ��д�����б�
			var forum_arr = [];
			$.each(cateforum_json['forum'][current_fid], function(i, o){
				forum_arr.push('<li class="J_fresh_forum_item" data-fid="'+ o[0] +'">'+ o[1] +'</li>');
			});
			fresh_forum.html(forum_arr.join(''));
		}catch(e) {};
	});
	
	//������
	fresh_forum.on('click', 'li.J_fresh_forum_item', function(){
		$(this).addClass('current').siblings('.current').removeClass('current');
		
		fresh_post_to_forum.text($(this).text().replace(/-/g, ''));								//���м
		fresh_post_pop_close.removeClass('disabled').removeProp('disabled');		//ȷ����ť����
	});
	
	//���ȷ��
	fresh_post_pop_close.on('click', function(e){
		//e.preventDefault();
		var current_li = fresh_forum.children('li.current'),								//ѡ�а��
				current_fid = current_li.data('fid');														//ѡ�еİ��id

		if(document.getElementById('J_forum_join').checked) {
			//������
			$.post(FORUM_JOIN, {fid : current_fid}, function(data){
				fresh_post_forum_wrap.hide();
			}, 'json');
		}else{
			fresh_post_forum_wrap.hide();
		}

		fresh_forum_btn.find('.J_text').text(current_li.text().replace(/-/g, ''));		//��ʾ��ѡ���
		fresh_post_fid.val(current_fid);												//inputֵ

		//ͼƬ�ϴ�fid����
		try{
			swfu.settings.post_params.fid = current_fid;
			swfu.setPostParams(swfu.settings.post_params);
		}catch(e){
			$.error(e);
		}
		
	});
	
	//����
	fresh_post_sub.on('click', function(e){
		e.preventDefault();
		var fid = fresh_post_fid.val();
		if(!fid) {
			fresh_forum_btn.click();
			return false;
		}

		$('#J_fresh_post_form').ajaxSubmit({
			dataType : 'html',
			beforeSubmit : function(){
				Wind.Util.ajaxBtnDisable(fresh_post_sub);
			},
			success : function(data, statusText, xhr, $form) {
				$("input[name=topictype]").remove();
				$("input[name=sub_topictype]").remove();
				if(data.indexOf("��ѡ���������") > 0){
					Wind.Util.ajaxBtnEnable(fresh_post_sub);
					//�����������
					Wind.js(GV.JS_ROOT + 'pages/bbs/topicType.js?v=' + GV.JS_VERSION, function(){
						var url = GV.URL.TOPIC_TYPIC;
						var topic = new ShowTopicPop({url: url, fid: fid, callback: function(data){
								if(data){
									$(data).each(function(i, item){
									if(i === 0){
										item.name = 'topictype';
									}
									if(i === 1){
										item.name = 'sub_topictype';
									}
									$('#J_fresh_post_form').append('<input type="hidden" name = "'+item.name+'" value="'+item.val+'" />');
								});
								//ģ���ύ
								fresh_post_sub.click();
								}
							}});
							topic.init();
					});
					return false;
				}
				Wind.Util.ajaxBtnEnable(fresh_post_sub);
				if(Wind.Util.ajaxTempError(data, fresh_post_sub)) {
					if(data.indexOf('���') > 0) {
						$form.resetForm();
						fresh_post_fid.val('');		//ff ���ز���reset
						fresh_forum_btn.find('.J_text').text('ѡ����');
						fresh_post_sub.prop('disabled', true).addClass('disabled');
						fresh_upload_queue.hide();
						$('a.J_fresh_upload_del').click();
					}
					return;
				}

				$form.resetForm();
				fresh_post_fid.val('');		//ff ���ز���reset
				fresh_forum_btn.find('.J_text').text('ѡ����');
				fresh_post_sub.prop('disabled', true).addClass('disabled');
				fresh_upload_queue.hide();
				$('a.J_fresh_upload_del').click();

				//��ʾ global.js
				Wind.Util.postTip({
					elem : fresh_post_ta,
					msg : '���ͳɹ�',
					callback : function(){
						if(!feed_lists.children().length) {
							window.location.reload();
						}
					}
				});

				if(!feed_lists.children().length) {
					return;
				}

				//���ֽ���
				Wind.Util.creditReward();

				$('#J_news_tip').after(data);

				Wind.Util.avatarError($('#J_feed_lists dl').first().find('img.J_avatar'));

				//�õ�Ƭ
				var gallery_list = $('ul.J_gallery_list');
				if(gallery_list.length) {
					if($.fn.gallerySlide) {
						gallery_list.gallerySlide();
					}else{
						Wind.use('gallerySlide', function(){
							gallery_list.gallerySlide();
						});
					}
				}

			}
		})
	});
	

	//��ť����״̬ global.js
	Wind.Util.buttonStatus(fresh_post_ta, fresh_post_sub);
	Wind.Util.ctrlEnterSub(fresh_post_ta, fresh_post_sub);

	//�ظ�����
	feed_lists.on('click', 'a.J_fresh_emotion', function(e){
		e.preventDefault();
		insertEmotions($(this), $($(this).data('emotiontarget')));
	});

	function swfHandle(){
		//ͼƬ�ϴ�
		Wind.js(GV.JS_ROOT +'util_libs/swfupload/plugins/swfupload.pluginMain.js?v='+ GV.JS_VERSION, function(){
			var fresh_upload_ul = $('#J_fresh_upload_queue > ul'), //����ul
				fresh_upload_info = $('#J_fresh_upload_info'), //��Ϣ
				fresh_count = fresh_upload_info.children('.J_count'), //ͳ��
				fresh_continue = fresh_upload_info.children('a.J_continue'), //�����ϴ�
				PIC_LIMIT = parseInt(fast_upload_config.num_limit); //ͼƬ�ϴ���������

			swfu = new SWFUpload({
				//debug : true,
				upload_url : IMG_UPLOAD,		//�ϴ���ַ

				flash_url : GV.JS_ROOT+ 'util_libs/swfupload/Flash/swfupload.swf', 
				post_params: {
					uid : GV.U_ID,
					csrf_token : GV.TOKEN
				},
				/*custom_settings : {
					progressTarget : "fsUploadProgress",
					cancelButtonId : "btnCancel"
				},*/
				file_size_limit : fast_upload_config.size_limit,
				file_types : fast_upload_config.types,
				file_upload_limit : PIC_LIMIT,
				button_placeholder_id : "J_fresh_swfupload", 
				button_image_url: GV.URL.IMAGE_RES+'/blank.gif',
				button_width: "65",
				button_height: "29",
				button_cursor : -2,
				button_text: '',
				button_text_style: ".icon_photo{ font-size: 14;}",
				button_text_left_padding: 22,
				button_text_top_padding: 0,
				button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
				requeue_on_error : true,
				swfupload_load_failed_handler: function(){
					$('#J_fresh_post_wrap').on('click', '.a_photo', function(){
						alert("����û�а�װFlash���,�����ϴ�ͼƬ");
					});
				},
				file_dialog_start_handler : function(){
					fresh_upload_queue.show();

					if(!fresh_post_fid.val()) {
						Wind.Util.resultTip({
							error : true,
							msg : '��ѡ����'
						});
					}
					
					if(PIC_LIMIT) {
						//����������

						if(fresh_upload_ul.children().length == (PIC_LIMIT+1)) {
							return;
						}

						fresh_upload_info.children('.J_count').text(PIC_LIMIT);

						var pic_li_arr = [];
						for(i=1; i <= PIC_LIMIT; i++) {
							pic_li_arr.push('<li class="J_pic_empty">'+ i +'</li>');
						}

						fresh_upload_ul.prepend(pic_li_arr.join(''));
					}else{
						fresh_upload_info.remove();
					}
				},
				file_queued_handler : function (file) {

					//���ͼƬ��ʾλ��
					var empty_box = fresh_upload_queue.find('li.J_pic_empty:eq(0)');
					if(!PIC_LIMIT && !empty_box.length) {
						//�����������޿�λ
						fresh_upload_ul.append('<li class="J_pic_empty"></li>');
						empty_box = fresh_upload_queue.find('li.J_pic_empty:eq(0)');
					}

					if(empty_box.length) {
						empty_box.replaceWith('<li id="'+ file.id +'" data-pos="'+ empty_box.text() +'"><div class="schedule"><em>0%</em><span style="width:0%;"></span></div></li>');
					}else {
						this.cancelUpload(file.id);//������ȡ���ϴ�
						fresh_upload_info.text('������������');
					}

				},
				file_queue_error_handler : function(file, errorCode, message) {
					try {
						var er;
						switch (errorCode) {
							case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
								er = "���ϴ���ͼƬ\""+ file.name +"\"̫����"+ "�������������Ϊ: " + this.settings.file_size_limit;
								break;
							case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
								er = "�벻Ҫ�ϴ�0�ֽڵ��ļ�";
								$.error("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
								break;
							case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
								er = "������ļ�����";
								break;
							case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
								er = '���ֻ���ϴ�'+ this.settings.file_upload_limit +'��ͼƬ';
								break;
							default:
								$.error("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
								break;
						}
						if(er) {
							Wind.Util.resultTip({
								error: true,
								msg: er,
								follow: $('.a_photo_flash')
							});
						}
					} catch (ex) {
		       		 $.error(ex);
		   		 }
				},
				file_dialog_complete_handler : function (numFilesSelected, numFilesQueued) {
					//��ʼ�ϴ�
					if(numFilesSelected > 1) {
					}
					
					this.startUpload();
				},
	   		//file_size_limit : "20480",
				upload_start_handler : function (file) {
					//��ʼ�ϴ��ļ�ǰ�������¼�������
					try {
						//up_tip.html('<span class="tips_loading">�����ϴ���У��</span>');
					}
					catch (ex) {}
			
					return true;
				},
				upload_progress_handler : function(file, bytesLoaded, bytesTotal) {
					try {
						var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
						var file_detail = $('#'+file.id);
						file_detail.find('em').text(percent + '%');//��ʾ����
						file_detail.find('span').css('width',percent + '%');//ʹ�ÿ������ʾ������
					} catch (ex) {
						$.error(ex);
					}
				},
				upload_success_handler : function(file, serverData) {
					try {
						var file_detail = $('#'+file.id);
						var data = $.parseJSON(serverData);//console.log(this.settings.post_params);console.log(fresh_post_fid.val());
						//console.log(file);
						if(data.state == 'success') {
							var _data = data.data;

							file_detail.data({
								//'serverData': _data,
								//'aid' : _data.aid
							}).addClass('uploaded');
							file_detail.html('<a data-id="'+ file.id +'" class="del J_fresh_upload_del" href="">ɾ��</a><img alt="�ϴ����" data-id="'+ _data.aid +'" src="'+ _data.path +'" width="100" height="100" alt="" /><input type="hidden" name="flashatt['+ _data.aid +'][desc]" value="'+ file.name +'">');

							//����
							var count = fresh_upload_info.children('.J_count');					//ͳ��
							count.text(count.text() - 1);
						}else{
							file_detail.replaceWith('<li class="J_pic_empty">'+ file_detail.data('pos') +'</li>');
							//restLimit();
							Wind.Util.resultTip({
								error : true,
								msg : data.message
							});

							//���� ����-1
							var stats = swfu.getStats();
							stats.successful_uploads--;
							swfu.setStats(stats);
							return;
						}
						
						//�ϴ��ɹ��󣬵���ɸ�����
						//��ʾ���ϴ�����
					} catch (ex) {
						$.error(ex);
					}
				},
				upload_complete_handler : function (file) {
					//���
					try {
						//����ϴ���ɺ󣬻���δ�ϴ��Ķ��У��Ǻͼ����Զ��ϴ�
						if (this.getStats().files_queued === 0) {
						} else {	
							this.startUpload();
						}
					} catch (ex) {
						$.error(ex);
					}
				},
				queue_complete_handler : function(){
				}

			});

			//ɾ��
			fresh_upload_queue.on('click', 'a.J_fresh_upload_del', function(e){
				e.preventDefault();
				var li = $(this).parents('li'),
					pos = li.index()+1,
					uploaded_last = fresh_upload_queue.find('li.uploaded:last');

				if((uploaded_last.index()+1) !== pos) {
					//ɾ���Ĳ������һ��
					li.insertAfter(uploaded_last);
					pos = li.index()+1;
				}
				li.replaceWith('<li class="J_pic_empty" data-pos="'+ pos +'">'+ pos +'</li>');

				restLimit();
			});

			//�ر��ϴ�
			$('#J_fresh_upload_close').on('click', function(e){
				e.preventDefault();
				fresh_upload_queue.hide();
			});
			
			//��������1
			function restLimit() {
				var stats = swfu.getStats();
				stats.successful_uploads--;
				swfu.setStats(stats);

				var count = fresh_upload_info.children('.J_count');					//ͳ��
				count.text(parseInt(count.text()) + 1);
			}

		});
	}

	

})();