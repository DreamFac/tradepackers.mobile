import {topmost} from "ui/frame"
import {Page} from "ui/page"
import {Observable, EventData} from "data/observable"
import {View} from "ui/core/view"
import { Inject, Injectable, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import {NgIf} from '@angular/common'
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import * as Drawer from "nativescript-telerik-ui/sidedrawer/angular"
import { SideDrawerLocation, RadSideDrawer } from 'nativescript-telerik-ui/sidedrawer'
import * as transitions from 'nativescript-telerik-ui/sidedrawer'
import {MenuOptionComponent} from "../menu-option/menu.option.component"
import * as Modal from "nativescript-angular/modal-dialog"

@Component({
    moduleId: module.id,
    selector: 'side-drawer',
    directives: [
            MenuOptionComponent,
            ROUTER_DIRECTIVES,
            Modal.ModalDialogHost
        ],
    templateUrl: './side.drawer.template.html',
    styleUrls: ['side.drawer.css'],
    providers: [ MenuOptionComponent ], 
    
})

export class SideDrawer implements OnInit, AfterViewInit {

    private _currentNotification: string
    
    constructor( 
        private _router : Router,
        private _page: Page, 
        private _menuOptionComponent : MenuOptionComponent ) {
            
        this._page.on("loaded", this.onLoaded, this)
    }

    @ViewChild(Drawer.RadSideDrawerComponent) public drawerComponent: Drawer.RadSideDrawerComponent
    private drawer: Drawer.RadSideDrawerComponent
    
    ngAfterViewInit() {
        

    }

    ngOnInit() {
        
    }

    public onLoaded(args) {
        this.drawerComponent.drawerLocation = SideDrawerLocation.Bottom.toString()
    }

    public get currentNotification(): string {
        return this._currentNotification;
    }

    public openDrawer() {

        let circle = this._page.getViewById('circle-drawer')
            circle.animate({
                scale: { x: 0, y: 0 },
                duration: 150
            })
                .then(() => {
                    this.drawerComponent.sideDrawer.showDrawer()
                })
        
    }

    public onDrawerOpening() {
        console.log("Drawer opening");
        this._currentNotification = "Drawer opening";
    }

    public onDrawerOpened() {
        console.log("Drawer openedasdfsadf");
        this._currentNotification = "Drawer opened";
    }

    public onDrawerClosing() {
        console.log("Drawer closing")

        let circle = this._page.getViewById('circle-drawer')
            circle.animate({
                scale: { x: 2.5, y: 2.5 },
                duration: 125
            })

        this._currentNotification = "Drawer closing"
    }

    public onDrawerClosed() {
        console.log("Drawer closed");
        this._currentNotification = "Drawer closed";
    }
}
