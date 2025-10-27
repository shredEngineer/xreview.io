"use client";

import React, { useState } from 'react';
import { CheckCircle, XCircle, Shield, Award, Users, FileText, Star, Network, UserCheck, Eye, Filter, BookOpen, GitBranch } from 'lucide-react';

/* Hoisted components to avoid "Cannot create components during render" ESLint error.
   These components were previously declared inside the main component body. */

const TrustBadge = React.memo(function TrustBadge({ status, count, score, trustScore, trustedPeers }) {
  if (status === 'verified') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1.5 rounded-md text-sm">
          <Shield className="w-4 h-4 text-gray-700" />
          <span className="text-gray-900 font-medium">Verified</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-700">{count} reviews</span>
          {typeof score === 'number' && (
            <>
              <span className="text-gray-500">•</span>
              <span className="flex items-center gap-1 text-gray-700">
                <Star className="w-4 h-4" />
                <span>{score.toFixed(1)}</span>
              </span>
            </>
          )}
        </div>
        {trustScore !== null && trustScore >= 80 && (
          <div className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-md text-sm font-medium">
            <Network className="w-4 h-4" />
            <span>{trustedPeers} trusted peer{trustedPeers > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    );
  } else if (status === 'under-review') {
    return (
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-md text-sm">
        <Eye className="w-4 h-4" />
        <span>Under Review</span>
      </div>
    );
  }
  return null;
});

const PaperCard = React.memo(function PaperCard({ work, onClick }) {
  return (
    <div
      onClick={() => onClick(work)}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
            {work.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span>{work.authors ? work.authors.join(', ') : work.authorAddress}</span>
            {work.institution && (
              <>
                <span className="text-gray-400">•</span>
                <span>{work.institution}</span>
              </>
            )}
          </div>
        </div>
        <TrustBadge
          status={work.reviewStatus}
          count={work.reviewCount}
          score={work.averageScore}
          trustScore={work.yourTrustScore}
          trustedPeers={work.trustedPeerReviews}
        />
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {work.abstract}
      </p>

      {work.yourTrustScore >= 80 && work.trustedPeerReviews > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-900">
            <UserCheck className="w-4 h-4 text-gray-700" />
            <span className="font-medium">
              Reviewed by {work.trustedPeerReviews} researcher{work.trustedPeerReviews > 1 ? 's' : ''} in your network
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
        <div className="flex items-center gap-4">
          {work.arxivId && (
            <span className="font-mono text-xs text-gray-600">
              {work.arxivId}
            </span>
          )}
          <span className="text-gray-600 px-2 py-0.5 bg-gray-100 rounded text-xs">
            {work.category}
          </span>
          {work.citationCount !== undefined && (
            <span className="text-gray-600 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>{work.citationCount} citations</span>
            </span>
          )}
        </div>
        {work.yourTrustScore !== null && (
          <div className="flex items-center gap-1.5 text-gray-900">
            <div className="text-xs text-gray-500">Trust Score</div>
            <div className="font-semibold">{work.yourTrustScore}%</div>
          </div>
        )}
      </div>
    </div>
  );
});

const PaperDetailModal = React.memo(function PaperDetailModal({ work, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8 border-b border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 pr-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 leading-tight">
                {work.title}
              </h2>
              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <span className="font-medium">{work.authors ? work.authors.join(', ') : work.authorAddress}</span>
                {work.institution && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{work.institution}</span>
                  </>
                )}
              </div>
              <TrustBadge
                status={work.reviewStatus}
                count={work.reviewCount}
                score={work.averageScore}
                trustScore={work.yourTrustScore}
                trustedPeers={work.trustedPeerReviews}
              />
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-gray-500 text-xs mb-1">Field</div>
              <div className="font-medium text-sm text-gray-900">{work.field || work.category}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-gray-500 text-xs mb-1">Identifier</div>
              <div className="font-mono text-xs text-gray-900">{work.arxivId || work.doi || 'N/A'}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-gray-500 text-xs mb-1">Citations</div>
              <div className="font-semibold text-gray-900">{work.citationCount || 0}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-gray-500 text-xs mb-1">Trust Score</div>
              <div className="font-semibold text-gray-900">{work.yourTrustScore || 'N/A'}%</div>
            </div>
          </div>

          {work.yourTrustScore !== null && work.yourTrustScore >= 80 && (
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-gray-900 p-2 rounded-md">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">
                    Verified by your trusted network
                  </div>
                  <div className="text-gray-700 text-sm">
                    {work.trustedPeerReviews} researcher{work.trustedPeerReviews > 1 ? 's' : ''} you personally trust reviewed this paper
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{work.yourTrustScore}%</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8">
          <h3 className="font-semibold text-lg text-gray-900 mb-3">Abstract</h3>
          <p className="text-gray-700 leading-relaxed mb-8">
            {work.abstract}
          </p>

          {work.reviews && work.reviews.length > 0 && (
            <>
              <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-700" />
                <span>Peer Reviews ({work.reviews.length})</span>
              </h3>
              <div className="space-y-4">
                {work.reviews.map((review, idx) => (
                  <div
                    key={idx}
                    className={`${
    review.inYourNetwork
        ? 'bg-gray-50 border-2 border-gray-900'
        : 'bg-white border border-gray-200'
} rounded-lg p-5`}
                  >
                    {review.inYourNetwork && (
                      <div className="mb-3">
                        <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded font-medium">
                          TRUSTED NETWORK
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{review.name || 'Anonymous'}</span>
                          {review.trustDegree && (
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded">
                              {review.trustDegree === 1 ? '1° Connection' : '2° Connection'}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {review.institution} {review.expertise && `• ${review.expertise}`}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>h-index: {review.hIndex || 'N/A'}</span>
                          <span>•</span>
                          <span>Reputation: {review.reputation}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.score)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-gray-900 text-gray-900" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default function XReviewInstitutional() {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedWork, setSelectedWork] = useState(null);
  const [userReputation] = useState(750);
  const [showTrustNetwork, setShowTrustNetwork] = useState(false);
  const [filterByTrust, setFilterByTrust] = useState(true);

  // Trusted Researchers in Your Network
  const [trustedPeers] = useState([
    {
      address: "0x123a...45bc",
      name: "Dr. Sarah Chen",
      institution: "MIT CSAIL",
      credentials: "PhD Computer Science",
      reputation: 950,
      expertise: ["Machine Learning", "Neural Networks"],
      paperCount: 127,
      hIndex: 42,
      trustDegree: 1,
      mutualConnections: 0
    },
    {
      address: "0x456d...78ef",
      name: "Prof. Alex Kumar",
      institution: "Stanford AI Lab",
      credentials: "Professor of Artificial Intelligence",
      reputation: 1200,
      expertise: ["Reinforcement Learning", "Robotics"],
      paperCount: 203,
      hIndex: 58,
      trustDegree: 1,
      mutualConnections: 0
    },
    {
      address: "0x789g...90hi",
      name: "Dr. Maria Rodriguez",
      institution: "Max Planck Institute",
      credentials: "PhD Physics",
      reputation: 1050,
      expertise: ["Quantum Computing", "Cryptography"],
      paperCount: 156,
      hIndex: 47,
      trustDegree: 1,
      mutualConnections: 0
    },
    {
      address: "0x987f...12cd",
      name: "Prof. James Wilson",
      institution: "Oxford University",
      credentials: "Professor of Biology",
      reputation: 820,
      expertise: ["Genetics", "CRISPR"],
      paperCount: 89,
      hIndex: 38,
      trustDegree: 2,
      mutualConnections: 2,
      trustedBy: ["Dr. Sarah Chen", "Prof. Alex Kumar"]
    }
  ]);

  const [suggestedPeers] = useState([
    {
      address: "0x445c...90ab",
      name: "Dr. Lisa Park",
      institution: "Berkeley AI Research",
      credentials: "PhD AI/ML",
      reputation: 1100,
      expertise: ["Computer Vision", "Deep Learning"],
      paperCount: 178,
      hIndex: 51,
      trustDegree: 2,
      mutualConnections: 3,
      trustedBy: ["Prof. Alex Kumar", "Dr. Maria Rodriguez", "Prof. James Wilson"]
    },
    {
      address: "0x334d...56ef",
      name: "Dr. Marcus Zhang",
      institution: "Cambridge Quantum Lab",
      credentials: "PhD Quantum Physics",
      reputation: 890,
      expertise: ["Quantum Information", "Entanglement"],
      paperCount: 92,
      hIndex: 35,
      trustDegree: 2,
      mutualConnections: 1,
      trustedBy: ["Dr. Sarah Chen"]
    }
  ]);

  const [submissions] = useState([
    {
      id: 1,
      title: "Attention Is All You Need: A Revised Framework for Transformer Efficiency",
      authors: ["Chen, L.", "Wang, Y.", "Martinez, R."],
      authorAddress: "0x742d...89ef",
      institution: "DeepMind Research",
      category: "Machine Learning",
      field: "AI/ML",
      arxivId: "2410.12345",
      doi: "10.48550/arXiv.2410.12345",
      reviewStatus: "verified",
      reviewCount: 5,
      averageScore: 4.6,
      citationCount: 234,
      abstract: "We propose a novel attention mechanism that reduces computational complexity from O(n²) to O(n log n) while maintaining model performance. Our approach uses hierarchical attention patterns inspired by biological neural systems.",
      yourTrustScore: 95,
      trustedPeerReviews: 2,
      submissionDate: "2024-10-15",
      reviews: [
        {
          reviewer: "0x123a...45bc",
          name: "Dr. Sarah Chen",
          institution: "MIT CSAIL",
          score: 5,
          comment: "Excellent work. The hierarchical attention mechanism is innovative and the empirical results are convincing. This addresses a critical bottleneck in transformer scaling.",
          reputation: 950,
          hIndex: 42,
          inYourNetwork: true,
          trustDegree: 1,
          expertise: "Machine Learning"
        },
        {
          reviewer: "0x987f...12cd",
          name: "Prof. James Wilson",
          institution: "Oxford University",
          score: 4,
          comment: "Solid theoretical foundation. Minor concerns about biological plausibility of the attention patterns, but engineering results are strong.",
          reputation: 820,
          hIndex: 38,
          inYourNetwork: true,
          trustDegree: 2,
          expertise: "Neural Systems"
        },
        {
          reviewer: "0xabc1...23de",
          name: "Anonymous Reviewer",
          institution: "Independent",
          score: 5,
          comment: "Well-written paper with solid experimental validation.",
          reputation: 450,
          hIndex: 15,
          inYourNetwork: false,
          trustDegree: null,
          expertise: "AI"
        }
      ]
    },
    {
      id: 2,
      title: "Quantum Error Correction Using Topological Codes in NISQ Devices",
      authors: ["Rodriguez, M.", "Zhang, H.", "Patel, K."],
      authorAddress: "0x892b...45cd",
      institution: "Max Planck Institute",
      category: "Quantum Physics",
      field: "Physics",
      arxivId: "2410.67890",
      doi: "10.48550/arXiv.2410.67890",
      reviewStatus: "verified",
      reviewCount: 7,
      averageScore: 4.8,
      citationCount: 156,
      abstract: "We demonstrate experimental implementation of surface codes for quantum error correction on current NISQ devices. Our results show 10x improvement in logical qubit coherence time with only 20% overhead.",
      yourTrustScore: 98,
      trustedPeerReviews: 3,
      submissionDate: "2024-10-10",
      reviews: [
        {
          reviewer: "0x456d...78ef",
          name: "Prof. Alex Kumar",
          institution: "Stanford AI Lab",
          score: 5,
          comment: "Breakthrough work. The experimental validation on real NISQ hardware is particularly impressive. This will accelerate practical quantum computing applications.",
          reputation: 1200,
          hIndex: 58,
          inYourNetwork: true,
          trustDegree: 1,
          expertise: "Quantum Computing"
        },
        {
          reviewer: "0x789g...90hi",
          name: "Dr. Maria Rodriguez",
          institution: "Max Planck Institute",
          score: 5,
          comment: "Thorough experimental methodology. The topological code implementation is elegant and the coherence time improvements exceed theoretical predictions.",
          reputation: 1050,
          hIndex: 47,
          inYourNetwork: true,
          trustDegree: 1,
          expertise: "Quantum Physics"
        },
        {
          reviewer: "0x123a...45bc",
          name: "Dr. Sarah Chen",
          institution: "MIT CSAIL",
          score: 5,
          comment: "Exceptional experimental design and analysis. Clear path to scalability.",
          reputation: 950,
          hIndex: 42,
          inYourNetwork: true,
          trustDegree: 1,
          expertise: "Quantum Systems"
        }
      ]
    },
    {
      id: 3,
      title: "CRISPR-Cas13 Variants for Precision RNA Editing in Human Cells",
      authors: ["Wilson, J.", "Park, L.", "Thompson, S."],
      authorAddress: "0x445c...90ab",
      institution: "Oxford University",
      category: "Biology",
      field: "Genetics",
      arxivId: "bioRxiv.2024.10.001",
      doi: "10.1101/2024.10.001",
      reviewStatus: "under-review",
      reviewCount: 2,
      averageScore: null,
      citationCount: 12,
      abstract: "Novel Cas13 variants enable targeted RNA editing with 95% specificity and minimal off-target effects. We demonstrate therapeutic potential in treating genetic disorders through transient mRNA modifications.",
      yourTrustScore: null,
      trustedPeerReviews: 0,
      submissionDate: "2024-10-20",
      reviews: []
    },
    {
      id: 6,
      title: "Neural Architecture Search Using Evolutionary Algorithms",
      authors: ["Kim, S.", "Lee, J.", "Anderson, M."],
      authorAddress: "0x556f...67gh",
      institution: "Google Brain",
      category: "Machine Learning",
      field: "AI/ML",
      arxivId: "2410.11111",
      doi: "10.48550/arXiv.2410.11111",
      reviewStatus: "verified",
      reviewCount: 4,
      averageScore: 4.3,
      citationCount: 89,
      abstract: "Automated neural architecture design using genetic programming. Our method discovers novel architectures that outperform hand-designed networks on ImageNet with 30% fewer parameters.",
      yourTrustScore: 45,
      trustedPeerReviews: 0,
      submissionDate: "2024-10-08",
      reviews: [
        {
          reviewer: "0xdef4...56gh",
          name: "Dr. Unknown Reviewer",
          institution: "Tech Institute",
          score: 4,
          comment: "Interesting evolutionary approach to neural architecture search.",
          reputation: 520,
          hIndex: 22,
          inYourNetwork: false,
          trustDegree: null,
          expertise: "ML"
        },
        {
          reviewer: "0xghi7...89jk",
          name: "Anonymous",
          institution: "Independent",
          score: 5,
          comment: "Solid experimental results on standard benchmarks.",
          reputation: 380,
          hIndex: 18,
          inYourNetwork: false,
          trustDegree: null,
          expertise: "AI"
        }
      ]
    }
  ]);

  const [pendingReviews] = useState([
    {
      id: 4,
      title: "Federated Learning with Differential Privacy for Medical Imaging",
      authors: ["Johnson, A.", "Schmidt, K."],
      authorAddress: "0x334d...56ef",
      institution: "Johns Hopkins Medicine",
      category: "Medical AI",
      field: "AI/ML + Medicine",
      arxivId: "2410.22222",
      citationCount: 5,
      abstract: "Privacy-preserving machine learning framework for training diagnostic models across multiple hospitals without sharing patient data. Achieves 92% accuracy on tumor detection."
    },
    {
      id: 5,
      title: "Graph Neural Networks for Protein Folding Prediction",
      authors: ["Zhang, L.", "Kumar, R."],
      authorAddress: "0x667e...78gh",
      institution: "DeepMind",
      category: "Computational Biology",
      field: "Biology + AI",
      arxivId: "2410.33333",
      citationCount: 18,
      abstract: "Novel GNN architecture that predicts protein structure with AlphaFold-level accuracy using 10x less compute. Applications to drug discovery and enzyme design."
    }
  ]);

  // TODO: Fix "Warning:(304, 40) ESLint: 'score' is defined but never used. (@typescript-eslint/no-unused-vars)" — is the property not displayed yet? don't leave any behind!
  // Fixed by rendering the average score in TrustBadge (star + value).

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gray-900 p-2.5 rounded-md">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    xreview
                  </h1>
                  <p className="text-xs text-gray-500 tracking-wide">DECENTRALIZED SCIENTIFIC REVIEW</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTrustNetwork(!showTrustNetwork)}
                className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Network className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">
                  Network ({trustedPeers.filter(p => p.trustDegree === 1).length})
                </span>
              </button>
              <div className="bg-gray-100 px-4 py-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">{userReputation}</span>
                </div>
              </div>
              <button className="bg-gray-900 text-white px-5 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">
                Connect
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-5 py-4 font-medium transition-colors ${
    activeTab === 'browse'
        ? 'text-gray-900 border-b-2 border-gray-900'
        : 'text-gray-500 hover:text-gray-700'
}`}
            >
              Browse Papers
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-5 py-4 font-medium transition-colors ${
    activeTab === 'review'
        ? 'text-gray-900 border-b-2 border-gray-900'
        : 'text-gray-500 hover:text-gray-700'
}`}
            >
              Review
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-5 py-4 font-medium transition-colors ${
    activeTab === 'submit'
        ? 'text-gray-900 border-b-2 border-gray-900'
        : 'text-gray-500 hover:text-gray-700'
}`}
            >
              Submit
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-5 py-4 font-medium transition-colors ${
    activeTab === 'about'
        ? 'text-gray-900 border-b-2 border-gray-900'
        : 'text-gray-500 hover:text-gray-700'
}`}
            >
              Methodology
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Info Banner */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="bg-gray-100 p-4 rounded-md">
              <GitBranch className="w-7 h-7 text-gray-900" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Your Personal Scientific Trust Network
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                xreview uses composable trust networks to solve the academic peer review crisis.
                You see only research verified by scientists you personally trust.
                This distributes authority while maintaining rigorous quality standards.
              </p>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>Open review process</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>Your network, your standards</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>Transparent methodology</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Research Papers</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setFilterByTrust(!filterByTrust)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
    filterByTrust
        ? 'bg-gray-900 text-white'
        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
}`}
                >
                  <Filter className="w-4 h-4" />
                  {filterByTrust ? 'Trusted Network' : 'All Papers'}
                </button>
                <select className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900">
                  <option>All Fields</option>
                  <option>AI/ML</option>
                  <option>Physics</option>
                  <option>Biology</option>
                  <option>Chemistry</option>
                  <option>Mathematics</option>
                </select>
                <select className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-900">
                  <option>Trust Score</option>
                  <option>Citations</option>
                  <option>Recent</option>
                </select>
              </div>
            </div>

            {filterByTrust && (
              <div className="bg-gray-100 border border-gray-300 rounded-md p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Network className="w-5 h-5 text-gray-700 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 mb-1">
                      Filtered by your trusted network
                    </div>
                    <p className="text-gray-700 text-sm">
                      Showing papers reviewed by at least one of the {trustedPeers.filter(p => p.trustDegree === 1).length} researchers you trust.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {submissions
                .filter(s => s.reviewStatus === 'verified')
                .filter(s => !filterByTrust || (s.trustedPeerReviews && s.trustedPeerReviews > 0))
                .sort((a, b) => (b.yourTrustScore || 0) - (a.yourTrustScore || 0))
                .map(work => (
                  <PaperCard key={work.id} work={work} onClick={setSelectedWork} />
                ))}
            </div>
          </div>
        )}

        {/* Review Tab */}
        {activeTab === 'review' && (
          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-5 mb-8">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-amber-900 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Build Scientific Reputation</h3>
                  <p className="text-amber-800 text-sm">
                    Review research to build your on-chain reputation. Quality reviews are recognized globally and contribute to the scientific community.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Papers Awaiting Review</h2>

            <div className="space-y-4">
              {pendingReviews.map(work => (
                <div key={work.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{work.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span>{work.authors.join(', ')}</span>
                        <span className="text-gray-400">•</span>
                        <span>{work.institution}</span>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-md text-xs font-medium">
                      Pending Review
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {work.abstract}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-mono text-xs text-gray-600">
                        {work.arxivId}
                      </span>
                      <span className="text-gray-600 px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {work.category}
                      </span>
                      <span className="text-gray-600 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{work.citationCount} citations</span>
                      </span>
                    </div>
                    <button className="bg-gray-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                      Review Paper
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Tab */}
        {activeTab === 'submit' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Submit Research</h2>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Paper Title</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Enter paper title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Field</label>
                    <select className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-900">
                      <option>Select field</option>
                      <option>AI/ML</option>
                      <option>Physics</option>
                      <option>Biology</option>
                      <option>Chemistry</option>
                      <option>Mathematics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Identifier (Optional)</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-900"
                      placeholder="arXiv ID, DOI"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Authors</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-900"
                    placeholder="Last, F., First, L., etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Institution</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-900"
                    placeholder="University or Research Institution"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Abstract</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 h-32 text-gray-900"
                    placeholder="Research abstract (200-300 words)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Upload Paper</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-gray-400 transition-colors">
                    <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 mb-1">Drop PDF or LaTeX source here</p>
                    <p className="text-gray-500 text-sm">Maximum file size: 20MB</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-5">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-700 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 mb-2">Review Process</div>
                      <ul className="text-gray-700 text-sm space-y-1.5">
                        <li>• Transparent peer review on distributed ledger</li>
                        <li>• Reviewed by qualified researchers in your field</li>
                        <li>• Typical review time: 7-14 days</li>
                        <li>• Build reputation through quality submissions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
                  Submit for Review
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Methodology Tab */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Methodology: Composable Trust Networks
              </h2>

              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">The Challenge</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Traditional academic peer review suffers from critical scalability issues.
                  The &quot;authority-availability product&quot; is fixed: only a limited number of qualified reviewers
                  have both the expertise and time to review papers. This creates bottlenecks, delays, and gatekeeping.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Solution</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  xreview implements composable trust networks that distribute reviewing authority while maintaining
                  quality. Any qualified researcher can review papers, but reviews are weighted based on trust relationships
                  you define. This creates personalized quality filters without centralized gatekeeping.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h3>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">1. Trust Network Construction</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    You curate a network of researchers whose scientific judgment you trust.
                    This forms your first-degree network.
                  </p>
                  <p className="text-gray-700 text-sm">
                    Second-degree connections (researchers trusted by your network) provide
                    additional filtering with lower weight.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">2. Trust Score Calculation</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Each paper receives a trust score based on reviews from your network:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-2 list-disc list-inside">
                    <li>First-degree reviews: High weight (1.0)</li>
                    <li>Second-degree reviews: Moderate weight (0.5)</li>
                    <li>Additional weighting by reviewer h-index and domain expertise</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">3. Quality Assurance</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Reviewers stake reputation on their assessments. Poor quality or biased
                    reviews decrease reviewer standing in the network.
                  </p>
                  <p className="text-gray-700 text-sm">
                    All reviews are transparent and verifiable on the distributed ledger.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">Benefits</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-md p-5">
                    <h4 className="font-medium text-gray-900 mb-2">For Readers</h4>
                    <ul className="text-gray-700 text-sm space-y-1.5">
                      <li>• Personalized quality filtering</li>
                      <li>• Efficient paper discovery</li>
                      <li>• Transparent review process</li>
                      <li>• Network-based recommendations</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-md p-5">
                    <h4 className="font-medium text-gray-900 mb-2">For Reviewers</h4>
                    <ul className="text-gray-700 text-sm space-y-1.5">
                      <li>• Recognition for quality reviews</li>
                      <li>• Build portable reputation</li>
                      <li>• Contribute to open science</li>
                      <li>• Network effects for visibility</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">Governance</h3>
                <p className="text-gray-700 leading-relaxed">
                  xreview operates as a decentralized platform with protocols that are transparent, auditable, and immutable.
                  Core review standards and algorithms are community-governed to ensure scientific rigor
                  and prevent gaming of the system.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Technical Implementation</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Trust Graph</div>
                  <div className="text-sm text-gray-600">Decentralized storage</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Reviews</div>
                  <div className="text-sm text-gray-600">Immutable ledger</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Reputation</div>
                  <div className="text-sm text-gray-600">Algorithmic calculation</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Paper Detail Modal */}
      {selectedWork && (
        <PaperDetailModal work={selectedWork} onClose={() => setSelectedWork(null)} />
      )}

      {/* Trust Network Management */}
      {showTrustNetwork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Trust Network</h2>
                  <p className="text-gray-600">Manage researchers whose reviews you trust</p>
                </div>
                <button
                  onClick={() => setShowTrustNetwork(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-gray-900 text-2xl font-semibold">{trustedPeers.filter(p => p.trustDegree === 1).length}</div>
                  <div className="text-gray-700 text-sm font-medium">First Degree</div>
                  <div className="text-gray-600 text-xs">Direct connections</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-gray-900 text-2xl font-semibold">{trustedPeers.filter(p => p.trustDegree === 2).length}</div>
                  <div className="text-gray-700 text-sm font-medium">Second Degree</div>
                  <div className="text-gray-600 text-xs">Network connections</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-gray-900 text-2xl font-semibold">{suggestedPeers.length}</div>
                  <div className="text-gray-700 text-sm font-medium">Suggested</div>
                  <div className="text-gray-600 text-xs">Discovered via network</div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Network className="w-5 h-5 text-gray-700" />
                  <span>First Degree Connections</span>
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  These researchers&apos; reviews carry the highest weight in your feed.
                </p>
                <div className="space-y-3">
                  {trustedPeers.filter(p => p.trustDegree === 1).map((peer, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-md p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">{peer.name}</span>
                            <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded">
                              1° Connection
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 mb-3">
                            {peer.credentials} • {peer.institution}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                            <span>h-index: {peer.hIndex}</span>
                            <span>•</span>
                            <span>{peer.paperCount} papers</span>
                            <span>•</span>
                            <span>Reputation: {peer.reputation}</span>
                          </div>
                          <div className="flex gap-2">
                            {peer.expertise.map((exp, i) => (
                              <span key={i} className="bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button className="text-gray-500 hover:text-gray-700 text-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-700" />
                  <span>Second Degree Network</span>
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Researchers trusted by your network. Moderate influence on your feed.
                </p>
                <div className="space-y-3">
                  {trustedPeers.filter(p => p.trustDegree === 2).map((peer, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-md p-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{peer.name}</span>
                          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded">
                            2° Connection
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 mb-3">
                          {peer.credentials} • {peer.institution}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          Trusted by: {peer.trustedBy.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-gray-700" />
                  <span>Suggested Researchers</span>
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Discovered through your trust network.
                </p>
                <div className="space-y-3">
                  {suggestedPeers.map((peer, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-md p-5 hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">{peer.name}</span>
                            <span className="text-gray-600 text-xs">
                              {peer.mutualConnections} mutual connection{peer.mutualConnections > 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 mb-3">
                            {peer.credentials} • {peer.institution}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                            <span>h-index: {peer.hIndex}</span>
                            <span>•</span>
                            <span>{peer.paperCount} papers</span>
                          </div>
                          <div className="flex gap-2">
                            {peer.expertise.map((exp, i) => (
                              <span key={i} className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded text-xs">
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Shield className="w-4 h-4" />
              <span>Decentralized Scientific Review Platform</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Documentation</a>
              <a href="https://github.com/shredEngineer/xreview.io" className="hover:text-gray-900">GitHub</a>
              <a href="mailto:paul@wilhelm.dev" className="hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
