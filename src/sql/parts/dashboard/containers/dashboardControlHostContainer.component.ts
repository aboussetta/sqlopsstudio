/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the Source EULA. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import 'vs/css!./dashboardControlHostContainer';

import { Component, forwardRef, Input, AfterContentInit, ViewChild } from '@angular/core';
import Event, { Emitter } from 'vs/base/common/event';
import { DashboardTab } from 'sql/parts/dashboard/common/interfaces';
import { TabConfig } from 'sql/parts/dashboard/common/dashboardWidget';
import { ControlHostContent } from 'sql/parts/dashboard/contents/controlHostContent.component';

@Component({
	selector: 'dashboard-controlhost-container',
	providers: [{ provide: DashboardTab, useExisting: forwardRef(() => DashboardControlHostContainer) }],
	template: `
		<controlhost-content [webviewId]="tab.id">
		</controlhost-content>
	`
})
export class DashboardControlHostContainer extends DashboardTab implements AfterContentInit {
	@Input() private tab: TabConfig;

	private _onResize = new Emitter<void>();
	public readonly onResize: Event<void> = this._onResize.event;

	@ViewChild(ControlHostContent) private _webviewContent: ControlHostContent;
	constructor() {
		super();
	}

	ngAfterContentInit(): void {
		this._register(this._webviewContent.onResize(() => {
			this._onResize.fire();
		}));

		let container = <any>this.tab.container;
		if (container['controlhost-container'] && container['controlhost-container'].type) {
			this._webviewContent.setControlType(container['controlhost-container'].type);
		}
	}

	public layout(): void {
		this._webviewContent.layout();
	}

	public get id(): string {
		return this.tab.id;
	}

	public get editable(): boolean {
		return this.tab.editable;
	}

	public refresh(): void {
		// no op
	}
}