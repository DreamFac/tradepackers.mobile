import { Component, ElementRef, OnInit, ViewChild, NgZone, Inject } from "@angular/core";
import {ModalDialogParams} from "nativescript-angular/modal-dialog";
import {Page} from "ui/page";
import {ListView} from "ui/list-view";
import { Router } from "@angular/router"
var webViewModule = require("ui/web-view");
import { WebView, LoadEventData } from 'ui/web-view'
import { LoginService } from './login.service'
import * as LocalStorage from 'application-settings'
import {Http, Response} from '@angular/http'

const updateQueryStringParameter = (uri, key, value) => {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    }

let http: Http

@Component({
  selector: "modal-content",
  template: `<StackLayout>
                <WebView id="oauthWebView" src="{{ url }}"></WebView>
            </StackLayout>`,
  providers: [ LoginService ]
})

export class ListPicker implements OnInit {

    public webView: WebView
    public url: string = LocalStorage.getString('webView-url')

    constructor ( private params: ModalDialogParams, 
                  @Inject(LoginService) public loginService: LoginService, 
                  private _page: Page,
                  private _http: Http,
                  private _router: Router ) {

        http = this._http
        this.url = LocalStorage.getString('webView-url')
        console.log('WEB VIEW CONSTRUCTOR::::::', this.url);

    }

    ngOnInit () {
        this.webView =  <WebView> this._page.getViewById('oauthWebView')
        this.webView.on(WebView.loadStartedEvent, this.callback);
    }

    public close ( result: string ) {
      this.params.closeCallback( result );
    }

    private callback (args: LoadEventData) : void {
            console.log("loadFinishedEvent called", args)
            let decodedUrl = args.url

            if (  args.url.indexOf('tradepackers.asuramedia.com') !== -1 &&
                  args.url.indexOf('redirect_uri') === -1 ) {
                
                decodedUrl = decodedUrl.replace('#_=_', '')
                decodedUrl = updateQueryStringParameter( decodedUrl, 'getToken', 'please' )

                http.get( decodedUrl )
                    .catch( (ex) => {
                        return ex
                    } )
                    .subscribe( ( result: Response ) => {
                        const json = result.json()
                        if ( result.status === 200 ) {
                            let token = json.Token
                            console.log('TOKEN::::', token)
                            this._router.navigate(['/main'])
                        }
                    } )
            }
        }

}