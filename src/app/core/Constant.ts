export const Constant = {
    // Tenant service
    CREATE_TENANT: 'tenant/create',
    GET_TENANT: 'tenant/',
    GET_TENANT_ALL: 'tenant/all/',
    EDIT_TENANT: 'tenant/Edit/',
    GET_TENANT_CLUSTER: 'tenant/AllInCluster',
    GET_TENANT_PAGINATION: 'tenant/Paging',
    GET_TENANT_REQUEST: 'Tenant/allrequest',
    DELETE_TENANT: 'tenant/',

    // Cluster service
    CREATE_SWARM: 'cluster/add',
    GET_SWARM: 'cluster/details/',
    GET_LIST_SWARM: 'Cluster/list/',
    GET_ALL_CLUSTER: 'Cluster/all',
    GET_CLUSTER_DASHBOARD: 'cluster/dashboard',
    UPDATE_CLUSTER: 'cluster/update',
    DELETE_CLUSTER: 'cluster/',

    // Minio
    GET_POLICY: 'bucket/policy',
    PUBLIC: 'bucket/setDownloadPolicy',
    PRIVATE: 'Bucket/setNonePolicy',
    LIST_BUCKETS: 'bucket/GetListBucket',
    LIST_OBJECTS: 'object/listObject',
    OBJECT_INFO: 'object/info',
    OBJECTS_PAGINATION: 'Bucket/objectsInBucket',
    MAKE_BUCKET: 'bucket/create',
    REMOVE_BUCKET: 'bucket',
    REMOVE_OBJECT: 'object',
    PUT_OBJECT: 'minio/Upload',
    DOWNLOAD_OBJECT: 'object/download',
    SEARCH_OBJECT: 'Object/search',
    PRESIGNED_PUT_OBJECT: 'minio/presignedputobject',
    LIST_BUCKET_OF_TENANT: 'bucket/all/tenant/',

    // Metadata
    GET_METADATA: 'MetaData/list',
    ADD_METADATA: 'MetaData/add',
    UPDATE_METADATA: 'MetaData/update',
  // dashboard
    TENANTRECENT: 'Dashboard/tenantrecenttop',
    TENANTSTORAGETOP: 'Dashboard/tenantstoragetop',
    CLUSTERSTORAGETOP: 'Dashboard/clusterstoragetop',
    TOTALSTORAGE: 'Dashboard/totalstorage',

    DETECT: 'api/yolo_predict',
    GETSERVICETYPE: 'ServiceType/all',
  };
