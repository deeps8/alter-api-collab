import { Component, OnInit } from '@angular/core';
import Typewriter from 't-writer.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const target = document.querySelector('.tw');

    const writer = new Typewriter(target, {
      loop: true,
      typeSpeed: 100,
      deleteSpeed: 50,
      typeColor: '#ff5722'
    });

    writer.type('Build')
          .rest(700)
          .remove(5)
          .type('Test')
          .rest(700)
          .remove(4)
          .type('Publish')
          .rest(700)
          .remove(7)
          .type('Monitor')
          .rest(700)
          .remove(7)
          .type('Document')
          .rest(700)
          .remove(8)
          .type('Collaborate')
          .rest(700)
          .clear()
          .start();

  }

}
