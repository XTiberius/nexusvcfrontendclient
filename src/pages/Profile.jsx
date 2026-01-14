import React, { useState, useEffect } from 'react';
import { User as Auth, Entity } from '@/api/localApi';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Building2, 
  ChevronDown, 
  ChevronUp,
  Shield,
  MapPin,
  Calendar,
  FileText,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddEntityDialog from '../components/profile/AddEntityDialog';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [expandedEntity, setExpandedEntity] = useState(null);
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await Auth.me();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const { data: entities = [], isLoading } = useQuery({
    queryKey: ['entities', user?.email],
    queryFn: () => Entity.filter({ created_by: user.email }),
    enabled: !!user?.email,
  });

  const entityTypeIcons = {
    Personal: User,
    Trust: Shield,
    LLC: Building2,
    Corporation: Building2,
    Partnership: Building2,
  };

  const entityTypeColors = {
    Personal: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Trust: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    LLC: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Corporation: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Partnership: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#00ff88] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-zinc-500 mb-8">Manage your account information and entities</p>

          {/* User Information */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00ff88]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#00ff88]" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Full Name</div>
                  <div className="font-medium">{user.full_name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00ff88]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#00ff88]" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Email</div>
                  <div className="font-medium">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00ff88]/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#00ff88]" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Role</div>
                  <Badge className="mt-1 bg-zinc-800 text-zinc-300 border-zinc-700">
                    {user.role === 'admin' ? 'Administrator' : 'Investor'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Entities */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Investment Entities</h2>
                <p className="text-sm text-zinc-500">Legal entities onboarded for investing</p>
              </div>
              <Button 
                onClick={() => setShowAddEntityDialog(true)}
                className="bg-[#00ff88] text-black hover:bg-[#00cc6a]" 
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Entity
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-[#00ff88] border-t-transparent rounded-full" />
              </div>
            ) : entities.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-400 mb-2">No entities yet</h3>
                <p className="text-sm text-zinc-500 mb-4">Add your first investment entity to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entities.map((entity, i) => {
                  const Icon = entityTypeIcons[entity.entity_type] || Building2;
                  const isExpanded = expandedEntity === entity.id;

                  return (
                    <motion.div
                      key={entity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border border-zinc-800 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedEntity(isExpanded ? null : entity.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-[#00ff88]" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{entity.entity_name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${entityTypeColors[entity.entity_type]} border text-xs`}>
                                {entity.entity_type}
                              </Badge>
                              {entity.is_primary && (
                                <Badge className="bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20 border text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Primary
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-zinc-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-zinc-500" />
                        )}
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="px-4 pb-4 border-t border-zinc-800"
                        >
                          <div className="pt-4 space-y-3">
                            {entity.tax_id && (
                              <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Tax ID</span>
                                <span className="text-zinc-300">{entity.tax_id}</span>
                              </div>
                            )}
                            {entity.address && (
                              <div className="flex items-start justify-between text-sm">
                                <span className="text-zinc-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  Address
                                </span>
                                <span className="text-zinc-300 text-right max-w-xs">{entity.address}</span>
                              </div>
                            )}
                            {entity.state && (
                              <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">State</span>
                                <span className="text-zinc-300">{entity.state}</span>
                              </div>
                            )}
                            {entity.formation_date && (
                              <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Formation Date
                                </span>
                                <span className="text-zinc-300">
                                  {new Date(entity.formation_date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {entity.accreditation_status && (
                              <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  Accreditation
                                </span>
                                <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
                                  {entity.accreditation_status}
                                </Badge>
                              </div>
                            )}
                            {entity.authorized_signers && entity.authorized_signers.length > 0 && (
                              <div className="text-sm">
                                <div className="text-zinc-500 mb-2">Authorized Signers</div>
                                <div className="flex flex-wrap gap-2">
                                  {entity.authorized_signers.map((signer, i) => (
                                    <Badge key={i} variant="outline" className="border-zinc-700 text-zinc-400">
                                      {signer}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {entity.documents && entity.documents.length > 0 && (
                              <div className="text-sm">
                                <div className="text-zinc-500 mb-2 flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  Documents ({entity.documents.length})
                                </div>
                                <div className="text-xs text-zinc-400">
                                  Formation documents, certificates, and other files on record
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AddEntityDialog 
        open={showAddEntityDialog} 
        onOpenChange={setShowAddEntityDialog}
      />
    </div>
  );
}