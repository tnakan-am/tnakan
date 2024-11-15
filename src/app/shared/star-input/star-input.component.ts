import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';

/**
 * @description StarInputComponent is created for setting 5 star review returns number from 1 to 5
 */
@Component({
  selector: 'app-star-input',
  standalone: true,
  imports: [MatIcon, NgClass],
  templateUrl: './star-input.component.html',
  styleUrl: './star-input.component.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => StarInputComponent), multi: true },
  ],
})
export class StarInputComponent implements ControlValueAccessor {
  @Input() rating = 0; // Initial rating value
  @Input() starCount = 5; // Number of stars, default is 5
  @Output() ratingChange = new EventEmitter<number>(); // Emits the new rating when changed

  hoverIndex = 0;
  isDisabled!: boolean;

  constructor() {}

  setRating(index: number): void {
    if (this.isDisabled) return;
    this.rating = index + 1;
    this.ratingChange.emit(this.rating);
    this.value = this.rating;
  }

  // Set hover index to highlight stars on hover
  setHover(index: number): void {
    if (!this.isDisabled) this.hoverIndex = index + 1;
  }

  // Clear hover index when leaving a star
  clearHover(): void {
    if (!this.isDisabled) this.hoverIndex = 0;
  }

  onChange: any = () => {};
  onTouch: any = () => {};
  val: number = 0; // this is the updated value that the class accesses
  set value(val: number) {
    // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
    this.val = val;
    this.rating = val;
    this.onChange(val);
    this.onTouch(val);
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // this method sets the value programmatically
  writeValue(value: any) {
    this.value = value;
  }
  // upon UI element value changes, this method gets triggered
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  // upon touching the element, this method gets triggered
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
}
