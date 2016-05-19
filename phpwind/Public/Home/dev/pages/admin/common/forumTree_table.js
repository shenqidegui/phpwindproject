/*

 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ��̨-�������/�����ȵ���ӡ�ɾ��������
 * @Author	: chaoren1641@gmail.com linhao87@gmail.com
 * @Depend	: core.js��jquery.js(1.7 or later)
 * 	��ҳ��Ҫ���������html����������磺һ��html����Ϊ"root_tr_html"����htmlΪ"child_tr_html"��ĳЩ����ҳ�滹������html�Σ��硱������á�����
 * 	html��������"root_", "child_", "id_"���ַ�(���һλ��Ϊ�»���)������js��������滻�������ύ�����ã�
 * 	��ҳ���input�ύ�������в�ͬ���ɺ�����
 *
 * ɾ����������á�ҳ������е�js����ҳ�涨��
 *
 * $Id: forumTree_table.js 16999 2012-08-30 07:14:27Z hao.lin $
 */
$(function () {
	var table_list = $('#J_table_list');
	
	if (table_list.length) {
		var child_id = 1;
		//��Ӹ�����&����·���&����»��֣���Ϊһ������
		//var temp_id = 1;
		$('#J_add_root').on('click', function (e) {
			e.preventDefault();
			child_id++; //���һ����ʱid����
			var $this = $(this), $tbody;
			
			//ת��&������յ�html��
			if ($this.data('type') === 'credit_root') {
				//�������ã��������е����»��ֵ�keyֵ����credit_run.htmҳ������
				last_credit_key = last_credit_key + 1;
				$tbody = $('<tbody>' + root_tr_html.replace(/root_/g, 'root_' + child_id).replace(/credit_key_/g, last_credit_key) + '</tbody>');
			} else {
				//����
				$tbody = $('<tbody>' + root_tr_html.replace(/root_/g, 'root_' + child_id).replace(/NEW_ID_/g, child_id) + '</tbody>');
			}
			
			//������
			table_list.append($tbody);
			$tbody.find('input.input').first().focus();
			
		});

		
		//��Ӷ�������&�Ӱ��ȣ���Ϊ��������������
		
		$('#J_table_list').on('click', '.J_addChild', function (e) {
			e.preventDefault();
			child_id++;
			var $this = $(this),
				id = $this.data('id'), //�������ӽṹ�Ĳ���
				$tr;
			
			//����ҳ���������
			var forum_level = $this.data('forumlevel') ? parseInt($this.data('forumlevel')) : ''; /*�������_����*/
			
			//ת��&������յ�html��
			if (forum_level && forum_level <= 4) {
			
				//������Ӱ�ť�Ƿ�data-nameid���ԣ��жϸ����Ƿ��ѱ���
				if($this.data('nameid')) {
					var name_id = $this.data('nameid');
				}
				//��������_������ã�forumChild()������setforum_run.htmģ��ײ����᷵�ء�����������顱��html��
				$tr = $(forumChild(forum_level, child_id, name_id).replace(/id_/g, id).replace(/NEW_ID_/, child_id));
				
			} else {
			
				//������html
				$tr = $(child_tr_html.replace(/child_/g, 'child_' + child_id).replace(/id_/g, id));
				
			}

			//�жϲ���λ�ã�������
			if ($this.data('html') === 'tbody') {
				//չ������
				$this.parents('tr').find('.J_start_icon.start_icon').click();
				
				//����°��&��Ӷ�����������Ҫ�ж�tbody��ǩ
				
				var tbody = $('#J_table_list_' + id);
				
				//���������򴴽�tbody��ǩ
				if (!tbody.length) {
					tbody = $('<tbody id="J_table_list_' + id + '"/>');
					tbody.insertAfter($this.parents('tbody'));
				}
				
				$tr.prependTo(tbody);
				
			} else if ($this.data('html') === 'tr') {
				//��Ӷ�������飬html����
				$tr.insertAfter($this.parents('tr'));
			}
			
			$tr.find('input.input').first().focus();
			
		});
		
		
		
		//����ӵ��п�ֱ��ɾ��
		table_list.on('click', 'a.J_newRow_del', function (e) {
			e.preventDefault();
			var tr = $(this).parents('tr'),
				tbody = $(this).parents('tbody');

			if(tr.next().length && !tr.prev().length) {
				//ɾ��һ������
				tbody.remove();
			}else{
				if(tbody.children().length === 1) {
					tbody.remove();
				}else{
					$(this).parents('tr').remove();
				}
			}
		});
		
		
		//���β˵�չ������
		var start_icon = $('.J_start_icon');
		start_icon.toggle(function (e) {
			var data_id = $(this).attr('data-id');
			$('#J_table_list_' + data_id).hide(100);
			$(this).removeClass('away_icon').addClass('start_icon');
		}, function () {
			var data_id = $(this).attr('data-id');
			$('#J_table_list_' + data_id).show(100);
			$(this).removeClass('start_icon').addClass('away_icon');
			
		});
		
		
		//չ��ȫ��
		$('#J_start_all').on('click', function (e) {
			e.preventDefault();
			var start_icons = $('.J_start_icon.start_icon');
			if (start_icons.length) {
				start_icons.removeClass('start_icon').addClass('away_icon');
				$('tbody[id^="J_table_list"]').show();
			}
		});
		
		
		//����ȫ��
		$('#J_away_all').on('click', function (e) {
			e.preventDefault();
			var away_icons = $('.J_start_icon.away_icon')
			if (away_icons.length) {
				away_icons.removeClass('away_icon').addClass('start_icon');
				$('tbody[id^="J_table_list"]').hide();
			}
		});
		
		//�������ȥ��ʾ��ӵ�����ť
		$('#J_table_list').on('mouseover', 'tr', function (e) {
			$(this).find('a.J_addChild').show();
		}).on('mouseout', 'tr', function (e) {
			$(this).find('a.J_addChild').hide();
		});
		
	}
	
});
