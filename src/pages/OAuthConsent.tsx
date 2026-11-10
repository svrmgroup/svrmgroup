import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import Logo from '@/components/svrm/Logo';
interface Details { client?: { name?: string }; redirect_uri?: string; scope?: string; scopes?: string[]; redirect_url?: string; redirect_to?: string }
interface Reply { data: Details | null; error: { message: string } | null }
interface OAuthApi { getAuthorizationDetails(id: string): Promise<Reply>; approveAuthorization(id: string): Promise<Reply>; denyAuthorization(id: string): Promise<Reply> }
const oauth = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
export default function OAuthConsent() {
 const [params] = useSearchParams();
 const id=params.get('authorization_id')??'';
 const [details,setDetails]=useState<Details|null>(null);
 const [error,setError]=useState('');
 const [email,setEmail]=useState('');
 const [busy,setBusy]=useState(false);
 const [allowed,setAllowed]=useState(false);
 const [retry,setRetry]=useState(0);
 useEffect(()=>{
 let active=true;setError('');setDetails(null);setAllowed(false);
 (async()=>{
 try{
 if(!id)throw new Error('This connection request is missing or expired. Start the connection again in your assistant.');
 const {data,error:sessionError}=await supabase.auth.getSession();
 if(sessionError)throw sessionError;
 if(!active)return;
 if(!data.session){window.location.assign('/admin/login?next='+encodeURIComponent(window.location.pathname+window.location.search+window.location.hash));return;}
 setEmail(data.session.user.email??'');
 const role=await supabase.from('user_roles').select('role').eq('user_id',data.session.user.id).eq('role','admin').maybeSingle();
 if(role.error||!role.data)throw new Error('Only authorised SVRM Group administrators can connect an assistant.');
 setAllowed(true);
 const reply=await oauth.getAuthorizationDetails(id);
 if(!active)return;
 if(reply.error)throw reply.error;
 const target=reply.data?.redirect_url??reply.data?.redirect_to;
 if(target&&!reply.data?.client){window.location.assign(target);return;}
 if(!reply.data?.client)throw new Error('This connection request is invalid or expired. Start it again in your assistant.');
 setDetails(reply.data);
 }catch(e){if(active)setError(e instanceof Error?e.message:(e as {message?:string})?.message??'Could not load this connection request.');}
 })();return()=>{active=false;};
 },[id,retry]);
 async function decide(approve:boolean){
 setBusy(true);setError('');
 try{
 if(approve&&!allowed)throw new Error('Admin permission is required.');
 const reply=await (approve?oauth.approveAuthorization(id):oauth.denyAuthorization(id));
 if(reply.error)throw reply.error;
 const target=reply.data?.redirect_url??reply.data?.redirect_to;
 if(!target)throw new Error('The connection could not return to your assistant. Please retry.');
 window.location.assign(target);
 }catch(e){setError(e instanceof Error?e.message:(e as {message?:string})?.message??'The decision could not be saved. Please retry.');setBusy(false);}
 }
 const client=details?.client?.name??'your assistant';
 const scopes=details?.scopes??details?.scope?.split(' ').filter(Boolean)??[];
 return <main className="min-h-screen bg-background text-foreground flex justify-center items-center p-6">
 <Helmet><title>Connect assistant · SVRM Group</title><meta name="robots" content="noindex,nofollow" /></Helmet>
 <section className="w-full max-w-lg space-y-6 border border-border bg-surface-raised p-6 sm:p-10">
 <Logo size="xl" />
 <h1 className="font-serif text-3xl">Connect {details?client:'an assistant'} to SVRM Group</h1>
 {error&&<p role="alert" className="text-destructive break-words">{error}</p>}
 {!details&&!error&&<p role="status" className="text-muted-foreground">Checking connection…</p>}
 {details&&<>
 <p className="text-sm text-muted-foreground break-all">Signed in as {email}</p>
 <p>This lets {client} read SVRM Group records as you.</p>
 {details.redirect_uri&&<p className="text-xs text-muted-foreground break-all">Connection destination: {details.redirect_uri}</p>}
 <ul className="text-sm space-y-2 list-disc pl-5"><li>Bookings and customer contact details</li><li>Stored invoices and recorded payment statuses</li><li>Supplier expenses and financial reports</li>
 {scopes.map(scope=><li key={scope}>{({openid:'Share your basic profile',profile:'Share your basic profile',email:'Share your email address'} as Record<string,string>)[scope]??`Additional permission requested: ${scope}`}</li>)}
 </ul>
 <p className="text-sm text-muted-foreground">Read-only. Your existing admin permissions still apply. No changes, payments or messages can be made.</p>
 <div className="flex flex-wrap gap-3"><Button disabled={busy||!allowed} onClick={()=>decide(true)}>Approve read-only access</Button><Button variant="outline" disabled={busy} onClick={()=>decide(false)}>Cancel connection</Button></div>
 </>}
 {error&&!details&&<Button variant="outline" onClick={()=>setRetry(v=>v+1)}>Try again</Button>}
 {email&&<Button variant="ghost" disabled={busy} onClick={async()=>{await supabase.auth.signOut();window.location.reload();}}>Switch account</Button>}
 </section></main>;
}
