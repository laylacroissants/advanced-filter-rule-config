import { Injectable } from '@angular/core';
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
  initialRule$ = this.initialRuleSubject.asObservable()

  constructor() {
    const storedRules = localStorage.getItem('ruleList');
    if (storedRules) {
      const parsedStoredRules = JSON.parse(storedRules)
      this.ruleListSubject.next(parsedStoredRules);
      this.selectedRuleSubject.next(parsedStoredRules[0])
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

  setSelectedRule(rule: any) {
    this.selectedRuleSubject.next(rule); // Set the selected rule
  }
}
