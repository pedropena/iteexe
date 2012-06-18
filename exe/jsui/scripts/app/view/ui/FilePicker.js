// ===========================================================================
// eXe
// Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//===========================================================================

Ext.define('eXe.view.ui.FilePicker', {
	extend: 'Ext.Window',
	id: 'filepicker',
	
	requires: [
		'eXe.view.ui.FileList',
		'eXe.view.ui.DirectoryTree'
	],
	
	statics: {
		returnOK: 0,
		returnCancel: 1,
		returnReplace: 2
	},
	
	status: null,

	file: {},
    initComponent: function() {
        var me = this;

        var filetypes = Ext.create('Ext.data.Store', {
        	fields: ['typename', 'extension'],
        	data: [
	        	{ "typename": "All files", "extension": "*.*" }
        	]
        });
        
        Ext.applyIf(me, {
        	width: 800,
        	height: 600,
            layout:'border',
			dockedItems: [
				{
	        		xtype: 'textfield',
	        		name: 'name',
	        		fieldLabel: 'Place',
	        		dock: 'top',
	        		id: 'file_place_field'
				},{
	            	xtype: 'container',
	            	layout: 'hbox',
	            	dock: 'bottom',
	            	ui: 'footer',
	            	items: [
	            		{ xtype: 'component', flex: 1 },
						{ xtype: 'button', text: 'Cancel', itemId: 'filepicker_cancel' },
						{ xtype: 'button', text: 'Open', itemId: 'filepicker_open' }
	            	]
	            },{
	            	xtype: 'container',
	            	layout: 'hbox',
	            	dock: 'bottom',
	            	ui: 'footer',
	            	items: [
	            		{ xtype: 'component', flex: 1 },
	            		{
	            			xtype: 'combo',
	            			itemId: 'file_type_combo',
	            			queryMode: 'local',
			            	store: filetypes,
			            	displayField: 'typename',
			            	valueField: 'extension',
			            	forceSelection: true,
			            	value: "*.*"
	            		}
	            	]
	            }
	            
			],
            fbar: [
			],
			items: [
				{
					xtype: "dirtree",
					region: "west"			
				},{
						
					region: "center",
					xtype: "tabpanel",
					itemId: "mainpanel",
					enableTabScroll: true,
					activeTab: 0,
					layout: {
			            type: 'border',
			            padding: 5
	       			},
					items: [{
						xtype: "filelist",
						region: "center"
					}]
				}
			],
			listeners: {
				destroy: this.callback
			}
        });
        
        me.callParent(arguments);
    }    
});