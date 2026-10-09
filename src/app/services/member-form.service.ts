import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Member, FamilyMember, Donation, HelpReceived, RecommendationLetter } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MemberFormService {
  private fb = inject(FormBuilder);

  buildMemberForm(member?: Member, defaultTaluka: string = '', defaultVillage: string = ''): FormGroup {
    const initialTaluka = member?.taluka || (defaultTaluka !== 'none' ? defaultTaluka : '');
    const initialVillage = member?.village || (defaultVillage !== 'none' ? defaultVillage : '');
    const defaultJoinedOn = member?.joinedOn || new Date().toISOString().substring(0, 10);
    const defaultAlive = (member?.alive ?? '') === '' ? true : Boolean(member?.alive);

    return this.fb.group({
      id: [member?.id || null],
      initial: [member?.initial || 'ज.'],
      fname: [member?.fname || '', Validators.required],
      lname: [member?.lname || 'शिकलगार', Validators.required],
      address: [member?.address || ''],
      district: [member?.district || 'सातारा', Validators.required],
      taluka: [initialTaluka, Validators.required],
      village: [initialVillage, Validators.required],
      phone: [member?.phone || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: [
        member?.age ?? 21,
        [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(99)]
      ],
      education: [member?.education || ''],
      occupation: [member?.occupation || ''],
      designation: [{ value: member?.designation || 'सभासद', disabled: true }, Validators.required],
      joinedOn: [defaultJoinedOn, Validators.required],
      alive: [defaultAlive],
      active: [member?.active ?? true],
      familyMembers: this.fb.array(
        member?.familyMembers ? member.familyMembers.map(m => this.createFamilyGroup(m)) : []
      ),
      donations: this.fb.array(
        member?.donations ? member.donations.map(d => this.createDonationGroup(d)) : []
      ),
      helpReceived: this.fb.array(
        member?.helpReceived ? member.helpReceived.map(h => this.createHelpGroup(h)) : []
      ),
      recommendationLetters: this.fb.array(
        member?.recommendationLetters ? member.recommendationLetters.map(r => this.createRecommendationGroup(r)) : []
      )
    });
  }

  createFamilyGroup(data?: FamilyMember): FormGroup {
    const group = this.fb.group({
      relation: [data?.relation || ''],
      name: [data?.name || '', Validators.required],
      education: [data?.education || ''],
      age: [data?.age || null],
      gender: [data?.gender || ''],
      occupation: [data?.occupation || '']
    });

    group.get('relation')?.valueChanges.subscribe((selectedRelation: string | null) => {
      if (!selectedRelation) return;
      if (['मुलगी', 'पत्नी', 'आई'].includes(selectedRelation)) {
        group.get('gender')?.setValue('स्त्री');
      } else if (['मुलगा', 'वडील', 'पति'].includes(selectedRelation)) {
        group.get('gender')?.setValue('पुरुष');
      }
    });

    return group;
  }

  createDonationGroup(data?: Donation): FormGroup {
    return this.fb.group({
      date: [data?.date || new Date().toISOString().substring(0, 10)],
      amount: [data?.amount || null, [Validators.min(0)]],
      contributionType: [data?.contributionType || 'सभासद वर्गणी'],
      description: [data?.description || '']
    });
  }

  createHelpGroup(data?: HelpReceived): FormGroup {
    return this.fb.group({
      date: [data?.date || new Date().toISOString().substring(0, 10)],
      amount: [data?.amount || null, [Validators.min(0)]],
      helpType: [data?.helpType || 'आर्थिक'],
      description: [data?.description || '']
    });
  }

  createRecommendationGroup(data?: RecommendationLetter): FormGroup {
    return this.fb.group({
      date: [data?.date || new Date().toISOString().substring(0, 10)],
      name: [data?.name || '', Validators.required],
      description: [data?.description || '']
    });
  }
}