import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

export default function AddEntityDialog({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [entityType, setEntityType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationality: '',
    dob: '',
    entityName: '',
    ein: '',
    address: '',
  });

  const createEntityMutation = useMutation({
    mutationFn: async (data) => {
      return base44.entities.Entity.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['entities']);
      onOpenChange(false);
      setEntityType('');
      setFormData({
        firstName: '',
        lastName: '',
        nationality: '',
        dob: '',
        entityName: '',
        ein: '',
        address: '',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let entityData = {
      entity_type: entityType === 'Individual' ? 'Personal' : entityType,
    };

    if (entityType === 'Individual') {
      entityData.entity_name = `${formData.firstName} ${formData.lastName}`;
      entityData.authorized_signers = [`${formData.firstName} ${formData.lastName}`];
    } else {
      entityData.entity_name = formData.entityName;
      entityData.tax_id = formData.ein;
      entityData.address = formData.address;
    }

    createEntityMutation.mutate(entityData);
  };

  const isFormValid = () => {
    if (!entityType) return false;
    
    if (entityType === 'Individual') {
      return formData.firstName && formData.lastName && formData.nationality && formData.dob;
    } else {
      return formData.entityName && formData.ein && formData.address;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle>Add Investment Entity</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add a new entity for making investments
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Entity Type *</Label>
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="LLC">LLC</SelectItem>
                <SelectItem value="Corporation">Corporation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {entityType === 'Individual' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
            </>
          )}

          {(entityType === 'LLC' || entityType === 'Corporation') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="entityName">
                  {entityType === 'LLC' ? 'LLC Name' : 'Corporation Name'} *
                </Label>
                <Input
                  id="entityName"
                  value={formData.entityName}
                  onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder={entityType === 'LLC' ? 'e.g., ABC Holdings LLC' : 'e.g., XYZ Corp'}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ein">EIN *</Label>
                <Input
                  id="ein"
                  value={formData.ein}
                  onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="XX-XXXXXXX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="Street, City, State, ZIP"
                  required
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || createEntityMutation.isLoading}
              className="flex-1 bg-[#00ff88] text-black hover:bg-[#00cc6a]"
            >
              {createEntityMutation.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Add Entity'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}