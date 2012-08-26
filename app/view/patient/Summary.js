/**
 * summary.ejs.php
 * Description: Patient Summary
 * v0.0.1
 *
 * Author: Ernesto J Rodriguez
 * Modified: n/a
 *
 * GaiaEHR (Electronic Health Records) 2011
 *
 * @namespace Encounter.getVitals
 */
Ext.define('App.view.patient.Summary', {
	extend       : 'App.classes.RenderPanel',
	id           : 'panelSummary',
	pageTitle    : i18n['patient_summary'],
	pageLayout   : {
		type : 'hbox',
		align: 'stretch'
	},
	pid             : null,
	demographicsData: null,
	initComponent: function() {
		var me = this;

		me.stores = [];

		me.stores.push(me.immuCheckListStore        = Ext.create('App.store.patient.ImmunizationCheck'));
		me.stores.push(me.patientAllergiesListStore = Ext.create('App.store.patient.Allergies'));
		me.stores.push(me.patientMedicalIssuesStore = Ext.create('App.store.patient.MedicalIssues'));
		me.stores.push(me.patientSurgeryStore       = Ext.create('App.store.patient.Surgery'));
		me.stores.push(me.patientDentalStore        = Ext.create('App.store.patient.Dental'));
		me.stores.push(me.patientMedicationsStore   = Ext.create('App.store.patient.Medications'));


		me.pageBody = [
			me.tabPanel = Ext.create('Ext.tab.Panel', {
				flex       : 1,
				margin     : '3 0 0 0',
				bodyPadding: 0,
				frame      : false,
				border     : false,
				plain      : true,
				itemId     : 'centerPanel'
			}),
			{
				xtype      : 'panel',
				width      : 250,
				bodyPadding: 0,
				frame      : false,
				border     : false,
				bodyBorder : true,
				margin     : '0 0 0 5',
				defaults   : {
					layout: 'fit',
					margin: '5 5 0 5'
				},
				listeners  : {
					scope : me,
					render: me.rightColRender
				},
				items      : [
					{
						title      : i18n['active_medications'],
						itemId     : 'MedicationsPanel',
						hideHeaders: true,
						xtype      : 'grid',
						store      : me.patientMedicationsStore,
						columns    : [
							{
								header   : i18n['name'],
								dataIndex: 'medication',
								flex     : 1
							},
							{
								text     : i18n['alert'],
								width    : 55,
								dataIndex: 'alert',
								renderer : me.boolRenderer
							}

						]
					},
					{
						title      : i18n['immunizations'],
						itemId     : 'ImmuPanel',
						hideHeaders: true,
						xtype      : 'grid',
						store      : me.immuCheckListStore,
						region     : 'center',
						columns    : [
							{

								header   : i18n['name'],
								dataIndex: 'immunization_name',
								flex     : 1
							},
							{
								text     : i18n['alert'],
								width    : 55,
								dataIndex: 'alert',
								renderer : me.alertRenderer
							}

						]
					},
					{
						title      : i18n['allergies'],
						itemId     : 'AllergiesPanel',
						hideHeaders: true,
						xtype      : 'grid',
						store      : me.patientAllergiesListStore,
						region     : 'center',
						columns    : [
							{
								header   : i18n['name'],
								dataIndex: 'allergy',
								flex     : 1
							},
							{
								text     : i18n['alert'],
								width    : 55,
								dataIndex: 'alert',
								renderer : me.boolRenderer
							}
						]
					},
					{
						title      : i18n['active_problems'],
						itemId     : 'IssuesPanel',
						hideHeaders: true,
						xtype      : 'grid',
						store      : me.patientMedicalIssuesStore,
						columns    : [
							{

								header   : i18n['name'],
								dataIndex: 'code',
								flex     : 1
							},
							{
								text     : i18n['alert'],
								width    : 55,
								dataIndex: 'alert',
								renderer : me.boolRenderer
							}

						]

					},
					{
						title      : i18n['dental'],
						itemId     : 'DentalPanel',
						hideHeaders: true,
						xtype      : 'grid',
						store      : me.patientDentalStore,

						columns: [
							{

								header   : i18n['name'],
								dataIndex: 'title',
								flex     : 1

							}

						]

					},
					{
						title      : i18n['surgeries'],
						itemId     : 'SurgeryPanel',
						hideHeaders: true,
						xtype      : 'grid',
						store      : me.patientSurgeryStore,

						columns: [
							{
								dataIndex: 'surgery',
								flex     : 1
							}
						]
					},
					{
						title: i18n['appointments'],
						html : 'Panel content!'

					}
				]
			}
		];

		if(perm.access_demographics) {
			me.stores.push(me.patientAlertsStore = Ext.create('App.store.patient.MeaningfulUseAlert'));
			me.tabPanel.add({
				xtype      : 'form',
				title      : i18n['demographics'],
				action     : 'demoFormPanel',
				itemId     : 'demoFormPanel',
				border     : false,
				dockedItems: [
					{
						xtype: 'toolbar',
						dock : 'bottom',
						items: [
							'->',
							{
								xtype   : 'button',
								action  : 'readOnly',
								text    : i18n['save'],
								minWidth: 75,
								scope   : me,
								handler : me.formSave
							},
							'-',
							{
								xtype   : 'button',
								text    : i18n['cancel'],
								action  : 'readOnly',
								minWidth: 75,
								scope   : me,
								handler : me.formCancel
							}
						]
					}
				]
			});
		}
		if(perm.access_patient_notes) {
			me.stores.push(me.patientNotesStore = Ext.create('App.store.patient.Notes'));
			me.tabPanel.add({
				title      : i18n['notes'],
				itemId     : 'notesPanel',
				xtype      : 'grid',
				bodyPadding: 0,
				store      : me.patientNotesStore,
				columns    : [
					{
						text     : i18n['date'],
						dataIndex: 'date'
					},
					{
						header   : i18n['type'],
						dataIndex: 'type'
					},
					{
						text     : i18n['note'],
						dataIndex: 'body',
						flex     : 1
					},
					{
						text     : i18n['user'],
						dataIndex: 'user_name'
					}
				],
				tbar       : [
					{
						text   : i18n['add_note'],
						iconCls: 'icoAdd'
					}
				]
			});
		}
		if(perm.access_patient_reminders) {
			me.stores.push(me.patientRemindersStore = Ext.create('App.store.patient.Reminders'));
			me.tabPanel.add({
				title      : i18n['reminders'],
				itemId     : 'remindersPanel',
				xtype      : 'grid',
				bodyPadding: 0,
				store      : me.patientRemindersStore,
				columns    : [
					{
						text     : i18n['date'],
						dataIndex: 'date'
					},
					{

						header   : i18n['type'],
						dataIndex: 'type'
					},
					{
						text     : i18n['note'],
						dataIndex: 'body',
						flex     : 1
					},
					{
						text     : i18n['user'],
						dataIndex: 'user_name'
					}
				],
				tbar       : [
					{
						text   : i18n['add_reminder'],
						iconCls: 'icoAdd'
					}
				]
			})
		}
		if(perm.access_patient_vitals) {
			me.stores.push(me.vitalsStore = Ext.create('App.store.patient.Vitals'));
			me.tabPanel.add({
				title      : i18n['vitals'],
				autoScroll : true,
				bodyPadding: 0,
				items      : {
					xtype: 'vitalsdataview',
					store: me.vitalsStore
				}
			})
		}
		if(perm.access_patient_history) {
			me.stores.push(me.encounterEventHistoryStore = Ext.create('App.store.patient.Encounters'));
			me.tabPanel.add({
				title  : i18n['history'],
				xtype  : 'grid',
				store  : me.encounterEventHistoryStore,
				columns: [
					{
						header   : i18n['date'],
						dataIndex: 'start_date'
					},
					{
						header   : i18n['event'],
						dataIndex: 'brief_description',
						flex     : true
					},
					{
						header   : i18n['visit_category'],
						dataIndex: 'visit_category'
					}
				]
			})
		}
		if(perm.access_patient_documents) {
			me.stores.push(me.patientDocumentsStore = Ext.create('App.store.patient.PatientDocuments'));
			me.tabPanel.add({
				title  : i18n['documents'],
				xtype  : 'grid',
				store  : me.patientDocumentsStore,
				columns: [
					{
						xtype: 'actioncolumn',
						width: 26,
						items: [
							{
								icon    : 'ui_icons/preview.png',
								tooltip : i18n['view_document'],
								handler : me.onDocumentView,
								getClass: function() {
									return 'x-grid-icon-padding';
								}
							}
						]
					},
					{
						header   : i18n['type'],
						dataIndex: 'docType'
					},
					{
						xtype    : 'datecolumn',
						header   : i18n['date'],
						dataIndex: 'date',
						format   : 'Y-m-d'

					},
					{
						header   : i18n['title'],
						dataIndex: 'title',
						flex     : true,
						editor   : {
							xtype : 'textfield',
							action: 'title'
						}
					}
				],

				plugins: Ext.create('Ext.grid.plugin.RowEditing', {
					autoCancel  : true,
					errorSummary: false,
					clicksToEdit: 2

				}),

				tbar: [
					{
						xtype     : 'mitos.templatescombo',
						fieldLabel: i18n['available_documents'],
						width     : 320,
						labelWidth: 145,
						margin    : '10 0 0 10'

					},
					'-',
					{
						text   : i18n['add_document'],
						iconCls: 'icoAdd',
						scope  : me,
						handler: me.newDoc
					},
					'->',
					{
						text   : i18n['upload_document'],
						scope  : me,
						handler: me.uploadADocument
					},
					{
						xtype : 'panel',
						action: 'upload',
						region: 'center',
						items : [
							me.uploadWin = Ext.create('Ext.window.Window', {
								draggable  : false,
								closable   : false,
								closeAction: 'hide',
								items      : [
									{
										xtype      : 'form',
										bodyPadding: 10,
										width      : 400,
										items      : [
											{
												xtype     : 'filefield',
												name      : 'filePath',
												buttonText: i18n['select_a_file'] + '...',
												anchor    : '100%'
											}
										],
										api        : {
											submit: DocumentHandler.uploadDocument
										}
									}
								],
								buttons    : [
									{
										text   : i18n['cancel'],
										handler: function() {
											me.uploadWin.close();
										}
									},
									{
										text   : i18n['upload'],
										scope  : me,
										handler: me.onDocUpload
									}
								]
							})
						]
					}
				]
			})
		}
		if(perm.access_patient_preventive_care_alerts) {
			me.stores.push(me.patientsDismissedAlerts = Ext.create('App.store.patient.DismissedAlerts'));
			me.tabPanel.add({
				title  : i18n['dismissed_preventive_care_alerts'],
				xtype  : 'grid',
				store  : me.patientsDismissedAlerts,
				columns: [

					{
						header   : i18n['description'],
						dataIndex: 'description'
					},
					{
						xtype    : 'datecolumn',
						header   : i18n['date'],
						dataIndex: 'date',
						format   : 'Y-m-d'

					},
					{
						header   : i18n['reason'],
						dataIndex: 'reason',
						flex     : true

					},
					{
						header   : i18n['observation'],
						dataIndex: 'observation',
						flex     : true

					}
				],

				plugins: Ext.create('App.classes.grid.RowFormEditing', {
					autoCancel  : false,
					errorSummary: false,
					clicksToEdit: 1,
					formItems   : [
						{
							title  : 'general',
							xtype  : 'container',
							padding: 10,
							layout : 'vbox',
							items  : [
								{
									/**
									 * Line one
									 */
									xtype   : 'fieldcontainer',
									layout  : 'hbox',
									defaults: { margin: '0 10 5 0' },
									items   : [
										{
											xtype     : 'textfield',
											name      : 'reason',
											fieldLabel: i18n['reason'],
											width     : 585,
											labelWidth: 70,
											action    : 'reason'
										}

									]

								},
								{
									/**
									 * Line two
									 */
									xtype   : 'fieldcontainer',
									layout  : 'hbox',
									defaults: { margin: '0 10 5 0' },
									items   : [

										{
											xtype     : 'textfield',
											fieldLabel: i18n['observation'],
											name      : 'observation',
											width     : 250,
											labelWidth: 70,
											action    : 'observation'
										},
										{
											fieldLabel: i18n['date'],
											xtype     : 'datefield',
											action    : 'date',
											width     : 200,
											labelWidth: 40,
											format    : 'Y-m-d',
											name      : 'date'

										},
										{
											xtype     : 'checkboxfield',
											name      : 'dismiss',
											fieldLabel: i18n['dismiss_alert']

										}

									]

								}
							]
						}

					]
				})
			})
		}
		if(perm.access_patient_billing) {
			me.tabPanel.add({
				xtype : 'panel',
				action: 'balancePanel',
				itemId: 'balancePanel',
				title : i18n['billing'],
				html  : i18n['account_balance'] + ': '

			})
		}

		me.listeners = {
			scope : me,
			render: me.beforePanelRender
		};

		me.callParent(arguments);
	},

	onDocumentView: function(grid, rowIndex) {
		var rec = grid.getStore().getAt(rowIndex),
			src = rec.data.url;
		app.onDocumentView(src);
	},

	uploadADocument: function() {
		var me = this,
			previewPanel = me.query('[action="upload"]')[0];
		me.uploadWin.show();
		me.uploadWin.alignTo(previewPanel.el.dom, 'tr-tr', [-5, 30])
	},
	onDocUpload    : function(btn) {
		var me = this,
			form = me.uploadWin.down('form').getForm(),
			win = btn.up('window');

		if(form.isValid()) {
			form.submit({
				waitMsg: i18n['uploading_document'] + '...',
				params : {
					pid    : me.pid,
					docType: 'UploadDoc'
				},
				success: function(fp, o) {
					win.close();
					me.patientDocumentsStore.load({params: {pid: me.pid}});
				},
				failure: function(fp, o) {
					//say(o.result.error);

				}
			});
		}
	},

	formSave: function(btn) {
		var me = this,
			form = btn.up('form').getForm(),
			record = form.getRecord(),
			values = form.getValues();

		values.pid = me.pid;
		record.set(values);
		record.store.save({
			scope   : me,
			callback: function() {
				me.getPatientImgs();
				me.verifyPatientRequiredInfo();
				me.readOnlyFields(form.getFields());
			}
		});
	},

	formCancel: function(btn) {
		var form = btn.up('form').getForm(),
			record = form.getRecord();
		form.loadRecord(record);
	},

	newDoc: function(btn) {
		app.onNewDocumentsWin(btn.action)
	},

	getFormData      : function(formpanel, callback) {

		var me = this, rFn, uFn;

		if(formpanel.itemId == 'demoFormPanel') {
			rFn = Patient.getPatientDemographicData;
			uFn = Patient.updatePatientDemographicData;
		}

		var formFields = formpanel.getForm().getFields().items, modelFields = [
			{name: 'pid', type: 'int'}
		];
		for(var i = 0; i < formFields.length; i++) {
			if(formFields[i].xtype == 'mitos.datetime') {
				modelFields.push({name: formFields[i].name, type: 'date', dateFormat: 'Y-m-d H:i:s'});
			} else {
				modelFields.push({name: formFields[i].name});
			}
		}
		var model = Ext.define(formpanel.itemId + 'Model', {
			extend: 'Ext.data.Model',
			fields: modelFields,
			proxy : {
				type: 'direct',
				api : {
					read  : rFn,
					update: uFn
				}
			}
		});

		var store = Ext.create('Ext.data.Store', {
			model: model
		});

		store.load({
			scope   : me,
			callback: function(records) {
				callback(formpanel.getForm().loadRecord(records[0]));
			}
		});

	},
	beforePanelRender: function() {
		if(perm.access_demographics) {
			var me = this, demoFormPanel = me.query('[action="demoFormPanel"]')[0],
				whoPanel,
				insurancePanel,
				primaryInsurancePanel,
				secondaryInsurancePanel,
				tertiaryInsurancePanel;
			this.getFormItems(demoFormPanel, 'Demographics', function(success) {
				if(success) {
					whoPanel = demoFormPanel.query('panel[title="Who"]')[0];
					insurancePanel = demoFormPanel.query('panel[action="insurances"]')[0];
					primaryInsurancePanel = insurancePanel.items.items[0];
					secondaryInsurancePanel = insurancePanel.items.items[1];
					tertiaryInsurancePanel = insurancePanel.items.items[2];

					whoPanel.insert(0, Ext.create('Ext.panel.Panel', {
						action     : 'patientImgs',
						layout     : 'hbox',
						style      : 'float:right',
						bodyPadding: 5,
						height     : 160,
						width      : 255,
						items      : [
							me.patientImg = Ext.create('Ext.container.Container', {
								html  : '<img src="ui_icons/patientPhotoId.jpg" height="119" width="119" />',
								margin: '0 5 0 0'
							}),
							me.patientQRcode = Ext.create('Ext.container.Container', {
								html  : '<img src="ui_icons/patientDataQrCode.png" height="119" width="119" />',
								margin: 0
							})
						],
						bbar       : [
							'-',
							{
								text   : i18n['take_picture'],
								scope  : me,
								handler: me.getPhotoIdWindow
							},
							'-',
							'->',
							'-',
							{
								text   : i18n['print_qrcode'],
								scope  : me,
								handler: function() {
									window.printQRCode(app.currPatient.pid);
								}
							},
							'-'
						]
					}));

					primaryInsurancePanel.insert(0, Ext.create('Ext.panel.Panel', {
						style : 'float:right',
						height: 182,
						width : 255,
						items : [
							me.primaryInsuranceImg = Ext.create('Ext.container.Container', {
								html: '<img src="ui_icons/no_card.jpg" height="154" width="254" />'
							}),
							me.primaryInsuranceImgUpload = Ext.create('Ext.window.Window', {
								draggable  : false,
								closable   : false,
								closeAction: 'hide',
								items      : [
									{
										xtype      : 'form',
										bodyPadding: 10,
										width      : 310,
										items      : [
											{
												xtype     : 'filefield',
												name      : 'filePath',
												buttonText: i18n['select_a_file'] + '...',
												anchor    : '100%'
											}
										],
										//   url: 'dataProvider/DocumentHandler.php'
										api        : {
											submit: DocumentHandler.uploadDocument
										}
									}
								],
								buttons    : [
									{
										text   : i18n['cancel'],
										handler: function(btn) {
											btn.up('window').close();
										}
									},
									{
										text   : i18n['upload'],
										scope  : me,
										action : 'Primary Insurance',
										handler: me.onInsuranceUpload
									}
								]
							})
						],
						bbar  : [
							'->',
							'-',
							{
								text   : i18n['upload'],
								action : 'primaryInsurance',
								scope  : me,
								handler: me.uploadInsurance
							},
							'-'
						]
					}));

					secondaryInsurancePanel.insert(0, Ext.create('Ext.panel.Panel', {
						style : 'float:right',
						height: 182,
						width : 255,
						items : [
							me.secondaryInsuranceImg = Ext.create('Ext.container.Container', {
								html: '<img src="ui_icons/no_card.jpg" height="154" width="254" />'
							}),
							me.secondaryInsuranceImgUpload = Ext.create('Ext.window.Window', {
								draggable  : false,
								closable   : false,
								closeAction: 'hide',
								items      : [
									{
										xtype      : 'form',
										bodyPadding: 10,
										width      : 310,
										items      : [
											{
												xtype     : 'filefield',
												name      : 'filePath',
												buttonText: i18n['select_a_file'] + '...',
												anchor    : '100%'
											}
										],
										//   url: 'dataProvider/DocumentHandler.php'
										api        : {
											submit: DocumentHandler.uploadDocument
										}
									}
								],
								buttons    : [
									{
										text   : i18n['cancel'],
										handler: function(btn) {
											btn.up('window').close();
										}
									},
									{
										text   : i18n['upload'],
										scope  : me,
										action : 'Secondary Insurance',
										handler: me.onInsuranceUpload
									}
								]
							})
						],

						bbar: [
							'->',
							'-',
							{
								text   : i18n['upload'],
								action : 'secondaryInsurance',
								scope  : me,
								handler: me.uploadInsurance
							},
							'-'
						]
					}));

					tertiaryInsurancePanel.insert(0, Ext.create('Ext.panel.Panel', {
						style : 'float:right',
						height: 182,
						width : 255,
						items : [
							me.tertiaryInsuranceImg = Ext.create('Ext.container.Container', {
								html: '<img src="ui_icons/no_card.jpg" height="154" width="254" />'
							}),
							me.tertiaryInsuranceImgUpload = Ext.create('Ext.window.Window', {
								draggable  : false,
								closable   : false,
								closeAction: 'hide',
								items      : [
									{
										xtype      : 'form',
										bodyPadding: 10,
										width      : 310,
										items      : [
											{
												xtype     : 'filefield',
												name      : 'filePath',
												buttonText: i18n['select_a_file'] + '...',
												anchor    : '100%'
											}
										],
										//   url: 'dataProvider/DocumentHandler.php'
										api        : {
											submit: DocumentHandler.uploadDocument
										}
									}
								],
								buttons    : [
									{
										text   : i18n['cancel'],
										handler: function(btn) {
											btn.up('window').close();
										}
									},
									{
										text   : i18n['upload'],
										scope  : me,
										action : 'Tertiary Insurance',
										handler: me.onInsuranceUpload
									}
								]
							})
						],
						bbar  : [
							'->',
							'-',
							{
								text: 'Upload',

								scope  : me,
								action : 'tertiaryInsurance',
								handler: me.uploadInsurance
							},
							'-'
						]
					}));

				}
			});
		}
	},

	uploadInsurance: function(btn) {

		var me = this,
			ImgContainer = btn.up('panel').down('container'),
			action = btn.action;
		if(action == 'primaryInsurance') {
			me.primaryInsuranceImgUpload.show();
			me.primaryInsuranceImgUpload.alignTo(me.primaryInsuranceImg.el.dom, 'br-br', [0, 0]);
		}
		else if(action == 'secondaryInsurance') {
			me.secondaryInsuranceImgUpload.show();
			me.secondaryInsuranceImgUpload.alignTo(me.secondaryInsuranceImg.el.dom, 'br-br', [0, 0]);
		}
		if(action == 'tertiaryInsurance') {
			me.tertiaryInsuranceImgUpload.show();
			me.tertiaryInsuranceImgUpload.alignTo(me.tertiaryInsuranceImg.el.dom, 'br-br', [0, 0]);
		}

	},

	rightColRender: function(panel) {
		var me = this;
		panel.getComponent('ImmuPanel').header.add({
			xtype  : 'button',
			text   : i18n['details'],
			action : 'immunization',
			scope  : me,
			handler: me.medicalWin


		});
		panel.getComponent('MedicationsPanel').header.add({
			xtype  : 'button',
			text   : i18n['details'],
			action : 'medications',
			scope  : me,
			handler: me.medicalWin


		});
		panel.getComponent('AllergiesPanel').header.add({
			xtype  : 'button',
			text   : i18n['details'],
			action : 'allergies',
			scope  : me,
			handler: me.medicalWin
		});
		panel.getComponent('IssuesPanel').header.add({
			xtype  : 'button',
			text   : i18n['details'],
			action : 'issues',
			scope  : me,
			handler: me.medicalWin
		});
		panel.getComponent('DentalPanel').header.add({
			xtype  : 'button',
			text   : i18n['details'],
			action : 'dental',
			scope  : me,
			handler: me.medicalWin
		});
		panel.getComponent('SurgeryPanel').header.add({
			xtype  : 'button',
			text   : i18n['details'],
			action : 'surgery',
			scope  : me,
			handler: me.medicalWin
		});
		this.doLayout();
	},
	medicalWin    : function(btn) {
		app.onMedicalWin(btn);

	},

	getPatientImgs: function() {
		var me = this,
			number = Ext.Number.randomInt(1, 1000);
		me.patientImg.update('<img src="' + settings.site_url + '/patients/' + me.pid + '/patientPhotoId.jpg?' + number + '" height="119" width="119" />');
		me.patientQRcode.update('<a ondblclick="printQRCode(app.currPatient.pid)"><img src="' + settings.site_url + '/patients/' + me.pid + '/patientDataQrCode.png?' + number + '" height="119" width="119" title="Print QRCode" /></a>');
	},

	getPhotoIdWindow: function() {
		var me = this;
		me.PhotoIdWindow = Ext.create('App.classes.PhotoIdWindow', {
			title   : i18n['patient_photo_id'],
			loadMask: true,
			modal   : true
		}).show();
	},

	completePhotoId: function() {
		this.PhotoIdWindow.close();
		this.getPatientImgs();
	},

	onInsuranceUpload: function(btn) {
		var me = this,
			action = btn.action,
			win = btn.up('window'),
			form,
			imgCt;

		if(action == 'Primary Insurance') {
			form = me.primaryInsuranceImgUpload.down('form').getForm();
			imgCt = me.primaryInsuranceImg;
		}
		else if(action == 'Secondary Insurance') {
			form = me.secondaryInsuranceImgUpload.down('form').getForm();
			imgCt = me.secondaryInsuranceImg;
		}
		if(action == 'Tertiary Insurance') {
			form = me.tertiaryInsuranceImgUpload.down('form').getForm();
			imgCt = me.tertiaryInsuranceImg;
		}
		if(form.isValid()) {
			form.submit({
				waitMsg: i18n['uploading_insurance'] + '...',
				params : {
					pid    : app.currPatient.pid,
					docType: action
				},
				success: function(fp, o) {
					say(o.result.doc);
					win.close();
					imgCt.update('<img src="' + o.result.doc.url + '" height="154" width="254" />');

				},
				failure: function(fp, o) {
					say(o.result.error);
					win.close();
				}
			});
		}

	},
	/**
	 * verify the patient required info and add a yellow background if empty
	 */
	verifyPatientRequiredInfo: function() {
		var me = this,
			formPanel = me.query('[action="demoFormPanel"]')[0],
			field;

		me.patientAlertsStore.load({
			scope   : me,
			params  : {
				pid: me.pid
			},
			callback: function(records, operation, success) {

				for(var i = 0; i < records.length; i++) {
					field = formPanel.getForm().findField(records[i].data.name);
					if(records[i].data.val) {
						field.removeCls('x-field-yellow');
					} else {
						field.addCls('x-field-yellow');
					}
				}
			}

		});
	},
	/**
	 * allow to edit the field if the filed has no data
	 * @param fields
	 */
	readOnlyFields: function(fields) {
		for(var i = 0; i < fields.items.length; i++) {
			var f = fields.items[i],
				v = f.getValue(),
				n = f.name;
			if(n == 'SS' || n == 'DOB' || n == 'sex') {
				if(v == null || v == '') {
					f.setReadOnly(false);
				} else {
					f.setReadOnly(true);
				}
			}
		}
	},

	/**
	 * load all the stores in the summaryStores array
	 */
	loadStores:function(){
		var me = this;
		for(var i=0; i < me.stores.length; i++){
			me.stores[i].load({params: {pid: me.pid}});
		}
	},

	/**
	 * This function is called from MitosAPP.js when
	 * this panel is selected in the navigation panel.
	 * place inside this function all the functions you want
	 * to call every this panel becomes active
	 */
	onActive: function(callback) {
		var me = this,
			billingPanel,
			demographicsPanel;

		if(me.checkIfCurrPatient()) {
			/**
			 * convenient way to refer to current pid within this panel
			 * @type {*}
			 */
			me.pid = app.currPatient.pid;
			/**
			 * get current set patient info
			 * @type {*}
			 */
			var patient = me.getCurrPatient();
			/**
			 * update panel main title to reflect the patient name and if the patient is read only
			 */
			me.updateTitle(patient.name + ' - #' + patient.pid + ' (' + i18n['patient_summary'] + ')', app.currPatient.readOnly);
			/**
			 * verify if the patient is on read only mode
			 */
			me.setReadOnly(app.currPatient.readOnly);

			me.setButtonsDisabled(me.query('button[action="readOnly"]'));

			/**
			 * get all the demographic data if user has access.
			 * including all the images (insurance cards, patient img, and QRcode)
			 */
			if(perm.access_demographics) {
				demographicsPanel = me.tabPanel.getComponent('demoFormPanel');
				demographicsPanel.getForm().reset();
				me.getFormData(demographicsPanel, function(form) {
					me.readOnlyFields(form.getFields());
				});
				me.getPatientImgs();
				me.verifyPatientRequiredInfo();
				Patient.getPatientInsurancesCardsUrlByPid(me.pid, function(url) {
					me.primaryInsuranceImg.update('<img src="' + (url.Primary.url ? url.Primary.url : 'ui_icons/no_card.jpg') + '" height="154" width="254" />');
					me.secondaryInsuranceImg.update('<img src="' + (url.Secondary.url ? url.Secondary.url : 'ui_icons/no_card.jpg') + '" height="154" width="254" />');
					me.tertiaryInsuranceImg.update('<img src="' + (url.Tertiary.url ? url.Tertiary.url : 'ui_icons/no_card.jpg') + '" height="154" width="254" />');
				});
			}
			/**
			 * get billing info if user has access
			 */
			if(perm.access_patient_billing) {
				billingPanel = me.tabPanel.getComponent('balancePanel');
				Fees.getPatientBalance({pid: me.pid}, function(balance) {
					billingPanel.update(i18n['account_balance'] + ': $' + balance);
				});
			}
			/**
			 * reset tab panel to the first tap
			 */
			me.tabPanel.setActiveTab(0);
			/**
			 * load all the stores
			 */
			me.loadStores();
		} else {
			callback(false);
			me.pid = null;
			me.currPatientError();
		}
	}

});