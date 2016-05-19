/*
 * PHPWind WindEditor Plugin
 * @Copyright 	: Copyright 2011, phpwind.com
 * @Descript	: �༭��@����
 * @Author		: chaoren1641@gmail.com
 * $Id: windeditor.js 4472 2012-02-19 10:41:01Z chris.chencq $			:
 */
;(function ( $, window, undefined ) {
	
	var WindEditor = window.WindEditor;
	
	var pluginName = 'atremind';
	
	WindEditor.plugin(pluginName,function() {
		var _self = this;
		var editorDoc = _self.editorDoc = _self.iframe[0].contentWindow.document;
		/*plugin_icon = $('<div class="wind_icon" data-control="'+ pluginName +'" unselectable="on"><span class="'+ pluginName +'" title="at"></span></div>').appendTo( _self.pluginsContainer );*/
		var atDialogDom;

		var KEY = { BACKSPACE : 8, TAB : 9, RETURN : 13, ESC : 27, LEFT : 37, UP : 38, RIGHT : 39, DOWN : 40, COMMA : 188, SPACE : 32, HOME : 36, END : 35 };
		var timer;
		//�������ݣ����ڻ������������
		var friendData,recentFriendData;
		var resultBox = '';
		//��ǰ��form
		var form = _self.textarea[0].form;
		var ime_mode = false;//�Ƿ�������״̬ true���ģ� falseӢ��

		/*
		* �����е�@����(��ʱȥ��)
		*/
		/*plugin_icon.on('click',function(e) {
			if($(this).hasClass('disabled')) {
				return;
			}
			if(atDialogDom && atDialogDom.length) {
				_self.showDialog(atDialogDom);
				dialogAfterShow();
			} else {
				$.get(AT_DIALOG_URL,function(data) {
					atDialogDom = $(data).appendTo(document.body);
					//�����е��¼�����
					dialogEventInit();
					_self.showDialog(atDialogDom);
					dialogAfterShow();
					//�����Ĺر��¼� 
					atDialogDom.find('a.edit_menu_close,a.J_at_close').on('click',function(e) {
						e.preventDefault();
						_self.hideDialog();
					});
				});
			}
		});

		//����ÿ�γ�����Ҫ�����һЩ�߼�
		function dialogAfterShow() {
			//�ѱ༭�������е�@���뵯��
			var tempNode = document.createDocumentFragment();
			var arr = [];
			$(_self.editorDoc).find('a').each(function() {
				if(this.href.indexOf(AT_USER_SPACE) !== -1) {
					var username = $(this).text().replace('@','');
					if($.inArray(username,arr) === -1) {
						arr.push(username);
						tempNode.appendChild(this.cloneNode(true));
					}
				}
			});
			
			if(tempNode.childNodes.length) {
				atDialogDom.find('div.info').html('���ᵽ��'+ arr.length + '�ˣ�').append(tempNode);
			}
		}

		function dialogEventInit() {
			//չ������
			atDialogDom.find('dt.J_friend_dt').on('click', function() {
				var $this = $(this),
					parent = $this.parent();
				parent.toggleClass('current').siblings().removeClass('current');

				if(!$this.siblings().length) {
					//δ������������
					$.getJSON($this.data('fanurl'), function(data){
						if(data.state == 'success') {
							var arr = [];
							$.each(data.data, function(key, value){
								arr.push('<dd data-id="'+ key +'" data-name="friend" class="J_friend_item" id="J_firend_dd_'+ key +'">'+ value +'</dd>')
							});
							$this.after(arr.join(''));
						}
					});
				}
			});

			var friend_selected = $('#J_friend_selected'),
				max = atDialogDom.data('max');		

			atDialogDom.on('click', 'dd.J_friend_item', function() {
				//ѡ�����
				var $this = $(this),
					id = $this.data('id');

				if($this.hasClass('disabled')) {
					return false;
				}
				if(!$this.hasClass('in') && friend_selected.children().length < max) {
					friend_selected.append('<li id="J_friend_'+ id +'"><input type="hidden" name="friend[]" value="'+ id +'" /><a href="#" class="J_friend_name" data-id="'+ id +'">'+ $this.text() +'<span  class="J_friend_del">��</span></a></li>');
					$this.addClass('in');
				}else {
					$this.removeClass('in');
					$('#J_friend_'+ id).remove();
				}
			}).on('click', '.J_friend_del', function(){
				//ɾ��ѡ��
				$(this).parents('li').fadeOut('fast', function(){
					$(this).remove();
				});
				$('#J_firend_dd_'+ $(this).data('id')).removeClass('in');
			}).on('click', 'a', function(e){
				e.preventDefault();
			});

			//����ύ����༭��
			atDialogDom.find('.edit_menu_btn').on('click',function(e) {
				e.preventDefault();
				var arr = [];
				friend_selected.find('.J_friend_name').each(function() {
					var username = $(this).text().replace('��','');
					var uid = $(this).data('id');
					arr.push('<span class="J_at" style="color:blue;" data-role="at" data-username="'+ username +'">@'+ username +'</span><span>&nbsp;</span>');
				});
				_self.insertHTML(arr.join('&nbsp'));
				_self.hideDialog();
				friend_selected.empty();
				atDialogDom.find('dd.in').removeClass('in');
			});
		}*/
		//����@�ڵ�
		function createAt (){
			var id = "tmp" + (+new Date());
			_self.insertHTML('<span class="J_at" id="'+ id +'">@</span>');
			var span = editorDoc.getElementById(id),
				range = _self.getRange(),
				sel = _self.getSelection();
			if(editorDoc.body.createTextRange) {
				range.moveToElementText(span);
				range.moveStart("character");
				range.select();
			}else {
				var ospan = span.firstChild;
                range.setStart(ospan, 1);
                range.setEnd(ospan, 1);
                sel.removeAllRanges();
                sel.addRange(range);
			}
			clearTimeout(timer);
			timer = setTimeout(function() {
				//ȡ���@��������
				showRecentFriendData($(span));
			},0);
		}

		/*
		* �༭���ļ���@
		*/
		$(_self.editorDoc).on({
			keydown:function(e) {
				var key = e.keyCode;
				var isAt = e.shiftKey && key === 50;
				//�Ƿ������뷨
				ime_mode = e.shiftKey && (key === 229 || key === 197 || key === 0);
				if(isAt) {
					e.preventDefault();
					createAt();
				}
				//�������̰�������������������ʾ���ҹ����@�У����ж�up��down��esc��enter
				if(resultBox.length && resultBox.is(':visible')) {
					var $span = _self.getRangeNode('span');
					if($span.length) {
						switch (e.which) {
					        case KEY.UP:
					        	e.preventDefault();
					        	movePrev();
					        	return;
					        case KEY.DOWN:
					        	e.preventDefault();
					          	moveNext();
					          	return;
					        case KEY.RETURN:
					        	e.preventDefault();
					        	choose();
					        	return;
					        case KEY.ESC:
					        	hideResultOptions();
					          break;
			      		}
					}
		      	}
			},
			keyup:function(e) {
				var key = e.keyCode;
				//ֻ����keyupʱ������ȫ��ȡ��ǰ��Ҫ��ʾ���˵����ƣ�keydownʱ��ȡ�������һ����ĸ
				var character = String.fromCharCode(e.which).toLowerCase();
				if(e.which > 36 && e.which <41) {
					//37,38,39,40�ֱ�����������Ҽ������˲˵�ʱ�����⼸����
					return;
				}
				//��������뷨ģʽ
				//console.log('����ģʽ:' + ime_mode)
				if(ime_mode){
					var range = _self.getRange();
					//��ȡ��길�ڵ�����һ���ڵ�
					if(!$.browser.msie){
						var node=range.startContainer;
						//���������ȡ�ڵ�����
						if(node&&node.nodeValue!=null){
							var len=node.length;
							var str=node.nodeValue.substr(len-1,1);
							if(str=="@"){
								//������ָո��������@ ��ɾ�����@Ȼ���������Լ���@
								range.setStart(node, len-1);
								range.setEnd(node, len);
								range.deleteContents();
								createAt();
							}
						}
					}else{
						var node=range.parentElement().lastChild;
						//���������ȡ�ڵ�����
						if(node&&node.nodeValue!=null){
							var len=node.length;
							var str=node.nodeValue.substr(len-1,1);
							if(str=="@"){
								node.nodeValue=node.nodeValue.substr(0,len-1)
								createAt();
							}
						}
					}
				}
				//���뷨ģʽ���
				
				var $span = _self.getRangeNode('span');
				if(!$span.length || !$span.hasClass('J_at')) {
					hideResultOptions();
					return;
				}
				var username = $span.text();
				if(username.indexOf('@') !== 0) {//����Ƿ���@
					hideResultOptions();
					return;
				}
				showRecentFriendData($span,username.replace('@',''));
				/*if(resultBox.length && resultBox.is(':visible')) {
					var span = _self.getRangeNode('span');
					if(span.length) {
						switch (e.keyCode) {
					        case KEY.UP:
					        	e.preventDefault();
					        	return;
					        case KEY.DOWN:
					        	e.preventDefault();
					          	return;
					        case KEY.RETURN:
					        	e.preventDefault();
					        case KEY.ESC:
					        	hideResultOptions();
					        	return;
			      		}
					}
		      	}
				var span = _self.getRangeNode('span');
				if(!span.length || !span.hasClass('J_at')) {
					hideResultOptions();
					return;
				}
				var username = span.text();
				if(username.indexOf('@') !== 0) {//����Ƿ���@
					hideResultOptions();
					return;
				}
				clearTimeout(timer);
				//������@��ͷ
				if(username === '@') {
					timer = setTimeout(function() {
						showRecentFriendData(span);
					},200);
				}else {
					//��@���������ֺ�����������������ȡ
					username = username.replace('@','');
					showFriendData(username,span);
				}*/
			},
			input:function(e) {
				//console.log(e)
				//console.log(e)
			}
		});
		
		//��ʾ���@��������
		function showRecentFriendData($span,filterName) {
			var showData;
			if(recentFriendData) {
				if(filterName) {
					showData = filterData(filterName,recentFriendData);
				}else {
					showData = recentFriendData;
				}
				showResultOptions(showData,$span);
			}else{
				$.getJSON(AT_URL,function(data) {
					if(data.state === 'success') {
						recentFriendData = data;//��������
						if(filterName) {
							showData = filterData(filterName,recentFriendData);
						}else {
							showData = recentFriendData;
						}
						showResultOptions(showData,$span);
					} else {
						$.error(data.message);
					}
				});
			}
		}
		//������һ������ȡ�����ģ�����Ҫ��ǰ�˹���
		function filterData(username,data) {
			var resultData = {};
			resultData.data = {};//ģ��������˵����ݸ�ʽ
			$.each(data.data,function(key,value) {
				var re = new RegExp(username);
				if(value.match(re)) {
					resultData.data[key] = value;
				}
			});
			return resultData;
		}
		
		//��ʾ����ѡ��
		function showResultOptions(data,$span) {
			var offset = $span.offset();
			if(!resultBox.length) {
				resultBox = $('<div class="edit_menu"></ul></div>');
				$(document.body).append(resultBox);
			}
			var arr = [],i = 0;
			/*if(text === '@') {
				arr.push('<li>ѡ�����@���˻�ֱ������</li>');
			}else {
				arr.push('<li>ѡ���ǳƻ����ÿո��������</li>');
			}*/
			$.each(data.data,function(key,value) {
				arr.push('<li data-id="'+ key +'"><a>'+ value +'</a></li>');
				i++;
			});
			if(i < 1) {
				hideResultOptions();
				return;
			}
			resultBox.html('<ul class="edit_menu_select edit_atul" id="atResult">'+ arr.join('') + '</ul>');
			resultBox.find('li:first').addClass('activate');
			var iframeOffset = _self.iframe.offset();
			resultBox.css({
				left:iframeOffset.left + offset.left,
				top:iframeOffset.top + offset.top + $span.height()
			}).show();
		}

		//��������
		function hideResultOptions() {
			if(resultBox && resultBox.length) {
				resultBox.hide();
			}
		}

		//���¼�ͷ����
		function moveNext() {
			var current = resultBox.find('li.activate');
			current.removeClass('activate');
			var next = current.next();
			if(next.length) {
				next.addClass('activate');
			}else {
				resultBox.find('li').first().addClass('activate');
			}
		}
		//���ϼ�ͷ����
		function movePrev() {
			var current = resultBox.find('li.activate');
			current.removeClass('activate');
			var prev = current.prev();
			if(prev.length) {
				prev.addClass('activate');
			}else {
				resultBox.find('li').last().addClass('activate');
			}
		}
		
		//�س�ѡ����������ѡ��
		function choose() {
			_self.focus();
			var current = resultBox.find('li.activate');
			if(current.length) {
				var $span = _self.getRangeNode('span');
				var username = current.text();
				var uid = current.data('id');
				var at = $('<span class="J_at" data-role="at" data-username="'+ username +'">@'+ username +'</span><span>&nbsp;</span>');
				$span.replaceWith(at);
				var range = _self.getRange();
				if(!range) {
					hideResultOptions();
					_self.setFocus($(_self.editorDoc.body));
					return;
				}
				if(range.moveToElementText) {
					//range.moveToElementText(nativeNode);
				}else {
					var node = at.next()[0];
					range.setStart(node, 1);
					range.setEnd(node,1);
					//range.collapsed = true;
					var sel = _self.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
			hideResultOptions();
		}
		
		//�����ǰѡ�е�ִ��@
		$(document.body).on('mouseenter','#atResult > li',function(e) {
			$(this).addClass('activate').siblings().removeClass('activate');
		}).on('click','#atResult > li',function() {
			choose();
		});
		
		$(_self).on('beforeGetContent.' + pluginName,function() {
			$(editorDoc.body).find('span.J_at').each(function() {
				$(this).replaceWith(this.innerHTML);
			});
		});

	});
})( jQuery, window);