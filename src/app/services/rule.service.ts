import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  private ruleListSubject = new BehaviorSubject<any[]>([]);
  private selectedRuleSubject = new BehaviorSubject<any>(null);  // Add a selected rule BehaviorSubject
  rules$ = this.ruleListSubject.asObservable();
  selectedRule$ = this.selectedRuleSubject.asObservable();  // Observable to listen for selected rule

  constructor() {
    const storedRules = localStorage.getItem('ruleList');
    if (storedRules) {
      this.ruleListSubject.next(JSON.parse(storedRules));
    }
  }

  getSavedRules() {
    return this.ruleListSubject.getValue();
  }

  saveRule(rule: any) {
    const rules = [...this.getSavedRules(), rule];
    this.ruleListSubject.next(rules);
    localStorage.setItem('ruleList', JSON.stringify(rules));
  }

  updateRule(index: number, updatedRule: any) {
    const rules = this.getSavedRules();
    rules[index] = updatedRule;
    this.ruleListSubject.next(rules);
    localStorage.setItem('ruleList', JSON.stringify(rules));
  }

  clearRule(index: number) {
    const rules = this.getSavedRules();
    rules.splice(index, 1);
    this.ruleListSubject.next(rules);
    localStorage.setItem('ruleList', JSON.stringify(rules));
  }

  // New method to set the selected rule
  setSelectedRule(rule: any) {
    this.selectedRuleSubject.next(rule);
  }
}
