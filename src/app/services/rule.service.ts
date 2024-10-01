import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  private ruleListSubject = new BehaviorSubject<any[]>([]);
  private selectedRuleSubject = new BehaviorSubject<any>(null);  // Add a selected rule BehaviorSubject
  initialRuleSubject = new BehaviorSubject<any>(null);
  rules$ = this.ruleListSubject.asObservable();
  selectedRule$ = this.selectedRuleSubject.asObservable();  // Observable to listen for selected rule

  ruleList = signal<any[]>([]);
  selectedRule = signal<any | null>(null);

  constructor() {
    const storedRules = localStorage.getItem('ruleList');
    if (storedRules) {
      const parsedStoredRules = JSON.parse(storedRules)

      //Signals
      this.ruleList.set(parsedStoredRules); 
      this.selectedRule.set(parsedStoredRules[0]);

      //RxJS 
      this.ruleListSubject.next(parsedStoredRules);
      this.selectedRuleSubject.next(parsedStoredRules[0])
    }
  }

  getSavedRules() {
    return this.ruleListSubject.getValue();
  }

  saveRule(rule: any) {
    const rules  = [...this.getSavedRules(), rule];

    this.ruleList.set(rules); //update signal
    this.ruleListSubject.next(rules); //update behaviour subject
    localStorage.setItem('ruleList', JSON.stringify(rules));
  }

  updateRule(index: number, updatedRule: any) {
    const updatedRules = this.getSavedRules();
    updatedRules[index] = updatedRule;

    this.ruleList.set(updatedRules); //signals
    this.ruleListSubject.next(updatedRules); // behavioursubject
    localStorage.setItem('ruleList', JSON.stringify(updatedRules));
  }

  clearRule(index: number) {
    const rules = this.getSavedRules();
    rules.splice(index, 1);

    this.ruleList.set(rules); //signals
    this.ruleListSubject.next(rules); // behavioursubject
    localStorage.setItem('ruleList', JSON.stringify(rules));
  }

  setSelectedRule(rule: any) {
    this.selectedRule.set(rule); //signal
    this.selectedRuleSubject.next(rule); //behaviourSubject
  }
}
